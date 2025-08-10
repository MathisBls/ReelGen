import boto3
from botocore.config import Config
from .config import settings

def s3_client():
    return boto3.client(
        "s3",
        endpoint_url=settings.s3_endpoint,
        aws_access_key_id=settings.s3_access_key,
        aws_secret_access_key=settings.s3_secret_key,
        region_name=settings.aws_region,
        config=Config(signature_version="s3v4"),
    )
