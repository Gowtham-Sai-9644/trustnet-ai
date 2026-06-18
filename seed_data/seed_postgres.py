import os
import sys
# Resolve absolute root directory and insert into sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))

import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from backend.app.core.config import settings
from backend.app.models.pg_models import User, Scan, Report, TrustResult, Base
import random
import uuid

async def seed_postgres_db():
    print("Connecting to PostgreSQL to seed tables...")
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    
    async with engine.begin() as conn:
        # Create tables if they do not exist
        await conn.run_sync(Base.metadata.create_all)
        
    async_session = sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        # Check if already seeded
        from sqlalchemy import select
        res = await session.execute(select(User).limit(1))
        if res.scalars().first():
            print("PostgreSQL tables already contain data. Skipping seeding.")
            return
            
        print("Inserting user configurations...")
        user_ids = []
        for i in range(10):
            uid = str(uuid.uuid4())
            user = User(
                id=uid,
                email=f"user-{i}@trustnet.ai",
                password_hash="pbkdf2:sha256:mock_hash_string_12345",
                role="user" if i > 1 else "investigator"
            )
            session.add(user)
            user_ids.append(uid)
            
        await session.commit()
        
        print("Inserting mock incident reports...")
        categories = [
            "Fake Job Scam", "Fake KYC Scam", "Lottery Scam", 
            "Marketplace Scam", "Investment Scam", "Advance Payment Scam"
        ]
        
        for i in range(100):
            rep = Report(
                id=str(uuid.uuid4()),
                user_id=random.choice(user_ids),
                reported_phone=f"+9198000{random.randint(10000, 99999)}",
                reported_upi=f"merchant-scammer-{random.randint(10, 99)}@ybl",
                reported_url=f"http://phish-store-link-{random.randint(100, 999)}.net",
                scam_category=random.choice(categories),
                description="This seller requested a refundable deposit before shipment, and blocked me on WhatsApp immediately.",
                loss_amount=random.randint(1000, 25000),
                reporter_ip="192.168.1.1"
            )
            session.add(rep)
            
        await session.commit()
        print("PostgreSQL tables successfully seeded.")

if __name__ == "__main__":
    asyncio.run(seed_postgres_db())
