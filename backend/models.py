import json
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, UniqueConstraint

from backend.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"
    __table_args__ = (
        UniqueConstraint("source", "external_id", name="uq_vehicle_source_external_id"),
    )

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    external_id = Column(String(255), nullable=False)
    source = Column(String(100), nullable=False, default="unknown")
    url = Column(String(500), nullable=False)
    nome = Column(String(255), nullable=False)
    marca = Column(String(255), nullable=True)
    preco = Column(Integer, nullable=True)
    ano_modelo = Column(String(20), nullable=True)
    observacoes = Column(Text, nullable=True)
    imagens = Column(Text, nullable=True)
    is_available = Column(Boolean, default=True, nullable=False)
    last_seen_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "external_id": self.external_id,
            "source": self.source,
            "url": self.url,
            "nome": self.nome,
            "marca": self.marca,
            "preco": self.preco,
            "ano_modelo": self.ano_modelo,
            "observacoes": self.observacoes,
            "imagens": self._parse_json(self.imagens),
            "is_available": self.is_available,
            "last_seen_at": self.last_seen_at.isoformat() if self.last_seen_at else None,
        }

    @staticmethod
    def _parse_json(value):
        if not value:
            return []
        if isinstance(value, list):
            return value
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, list) else []
        except (TypeError, ValueError):
            return [value]
