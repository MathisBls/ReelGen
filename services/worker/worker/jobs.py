import uuid
import tempfile
from datetime import datetime
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import select
import ffmpeg

from .utils import db, engine, s3_client, S3_BUCKET

# Automap pour éviter de ré-importer tes modèles API
Base = automap_base()
Base.prepare(autoload_with=engine)

Media = Base.classes.media
Transcript = Base.classes.transcripts
Clip = Base.classes.clips
ClipRendition = Base.classes.clip_renditions

def _generate_black_mp4(path: str, duration=6, size="1080x1920", fps=30):
    # Génère un mp4 noir (libx264) via ffmpeg
    (
        ffmpeg
        .input(f"color=c=black:s={size}:r={fps}", f="lavfi", t=duration)
        .output(path, vcodec="libx264", pix_fmt="yuv420p", movflags="faststart", preset="veryfast", video_bitrate="2500k")
        .overwrite_output()
        .run(quiet=True)
    )

def ingest_media(media_id: int):
    """Crée un transcript stub + 2-3 clips candidats, passe media -> ready."""
    with db() as session:  # type: Session
        m: Media | None = session.get(Media, media_id)
        if not m:
            return {"ok": False, "error": "media_not_found"}

        # status processing
        m.status = "processing"
        session.flush()

        # Transcript stub
        tr = Transcript(media_id=media_id, language="auto", words_json={"words": []}, created_at=datetime.utcnow())
        session.add(tr)
        session.flush()

        # Clips "candidats" (30s blocs pour tester)
        # Si tu as duration_s en DB, tu peux t'en servir sinon on met 0-30 / 30-60
        candidates = [(0.0, 30.0), (30.0, 60.0)]
        for (t0, t1) in candidates:
            c = Clip(
                media_id=media_id,
                t_start=t0, t_end=t1,
                score=None,
                title_suggested=None,
                desc_suggested=None,
                hashtags_json=[],
                status="candidate",
                created_at=datetime.utcnow(),
            )
            session.add(c)

        m.status = "ready"
        return {"ok": True, "media_id": media_id, "transcript_id": tr.id}

def render_rendition(rendition_id: int):
    """Génère un mp4 noir, uploade sur S3/MinIO, passe la rendition -> ready."""
    with db() as session:
        r: ClipRendition | None = session.get(ClipRendition, rendition_id)
        if not r:
            return {"ok": False, "error": "rendition_not_found"}

        r.status = "rendering"
        session.flush()

        tmp = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
        tmp.close()

        # 9:16 par défaut; adapte si tu stockes autre chose
        _generate_black_mp4(tmp.name, duration=6, size="1080x1920")

        key = f"renders/{uuid.uuid4()}.mp4"
        s3 = s3_client()
        s3.upload_file(tmp.name, S3_BUCKET, key)

        # s3_uri stockée : à toi de voir le format (ici s3://)
        r.s3_uri = f"s3://{S3_BUCKET}/{key}"
        r.status = "ready"

        return {"ok": True, "rendition_id": rendition_id, "key": key}
