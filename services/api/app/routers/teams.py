from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.db import get_db
from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.team import TeamCreate, TeamOut, MemberAdd, MemberOut

router = APIRouter()

ROLES = {"owner", "editor", "publisher"}

def assert_role(role: str):
    if role not in ROLES:
        raise HTTPException(400, detail=f"Invalid role. Allowed: {', '.join(sorted(ROLES))}")

def require_owner(db: Session, team_id: int, user_id: int):
    tm = db.query(TeamMember).filter(
        TeamMember.team_id == team_id, TeamMember.user_id == user_id
    ).first()
    if not tm or tm.role != "owner":
        raise HTTPException(status_code=403, detail="Owner role required")

@router.post("", response_model=TeamOut)
def create_team(body: TeamCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    team = Team(name=body.name)
    db.add(team); db.flush()  # pour avoir team.id
    # le créateur devient owner
    db.add(TeamMember(team_id=team.id, user_id=user.id, role="owner"))
    db.commit(); db.refresh(team)
    return TeamOut(id=team.id, name=team.name, created_at=team.created_at, my_role="owner")

@router.get("", response_model=list[TeamOut])
def list_my_teams(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    q = (
        db.query(Team, TeamMember.role)
        .join(TeamMember, TeamMember.team_id == Team.id)
        .filter(TeamMember.user_id == user.id)
        .options(joinedload(Team.members))
        .all()
    )
    return [
        TeamOut(id=t.id, name=t.name, created_at=t.created_at, my_role=role)
        for (t, role) in q
    ]

@router.get("/{team_id}/members", response_model=list[MemberOut])
def list_members(team_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # doit appartenir à l'équipe
    tm_me = db.query(TeamMember).filter_by(team_id=team_id, user_id=user.id).first()
    if not tm_me:
        raise HTTPException(403, detail="Not a member of this team")

    rows = (
        db.query(TeamMember, User)
        .join(User, User.id == TeamMember.user_id)
        .filter(TeamMember.team_id == team_id)
        .all()
    )
    return [
        MemberOut(user_id=u.id, email=u.email, role=tm.role, joined_at=tm.joined_at)
        for tm, u in rows
    ]

@router.post("/{team_id}/members", response_model=MemberOut)
def add_member(team_id: int, body: MemberAdd, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    require_owner(db, team_id, user.id)
    assert_role(body.role)

    # l'utilisateur doit déjà exister pour MVP
    u = db.query(User).filter(User.email == str(body.email)).first()
    if not u:
        raise HTTPException(404, detail="User not found")

    # évite doublon
    exists = db.query(TeamMember).filter_by(team_id=team_id, user_id=u.id).first()
    if exists:
        raise HTTPException(400, detail="Already a member")

    tm = TeamMember(team_id=team_id, user_id=u.id, role=body.role)
    db.add(tm); db.commit(); db.refresh(tm)
    return MemberOut(user_id=u.id, email=u.email, role=tm.role, joined_at=tm.joined_at)

@router.patch("/{team_id}/members/{user_id}", response_model=MemberOut)
def update_member_role(team_id: int, user_id: int, body: MemberAdd, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    require_owner(db, team_id, user.id)
    assert_role(body.role)

    tm = db.query(TeamMember).filter_by(team_id=team_id, user_id=user_id).first()
    if not tm:
        raise HTTPException(404, detail="Member not found")

    # empêcher qu'un owner se retire lui-même l'owner si seul owner
    if tm.role == "owner" and body.role != "owner":
        others = db.query(TeamMember).filter(TeamMember.team_id == team_id, TeamMember.role == "owner", TeamMember.user_id != user_id).count()
        if others == 0:
            raise HTTPException(400, detail="Cannot demote the only owner")
    tm.role = body.role
    db.commit()

    u = db.get(User, user_id)
    return MemberOut(user_id=u.id, email=u.email, role=tm.role, joined_at=tm.joined_at)

@router.delete("/{team_id}/members/{user_id}", status_code=204)
def remove_member(team_id: int, user_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # owner peut retirer n'importe qui; un user peut se retirer lui-même
    tm_me = db.query(TeamMember).filter_by(team_id=team_id, user_id=user.id).first()
    if not tm_me:
        raise HTTPException(403, detail="Not a member of this team")

    if user.id != user_id:
        if tm_me.role != "owner":
            raise HTTPException(403, detail="Owner role required to remove others")

    tm = db.query(TeamMember).filter_by(team_id=team_id, user_id=user_id).first()
    if not tm:
        return  # 204 no content

    # empêcher la suppression du dernier owner
    if tm.role == "owner":
        owners = db.query(TeamMember).filter(TeamMember.team_id == team_id, TeamMember.role == "owner").count()
        if owners <= 1:
            raise HTTPException(400, detail="Cannot remove the only owner")

    db.delete(tm); db.commit()
    return
