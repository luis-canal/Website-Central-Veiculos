import json
from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text

from .database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String(255), primary_key=True)
    external_id = Column(String(255), nullable=True, index=True)
    source = Column(String(100), nullable=True, index=True)
    nome = Column(String(255), nullable=True)
    marca = Column(String(255), nullable=True)
    versao = Column(String(255), nullable=True)
    ano = Column(Integer, nullable=True)
    km = Column(Integer, nullable=True)
    preco = Column(Integer, nullable=True)
    combustivel = Column(String(100), nullable=True)
    cambio = Column(String(100), nullable=True)
    cor = Column(String(100), nullable=True)
    placa = Column(String(20), nullable=True)
    imagens = Column(Text, nullable=True)
    descricao = Column(Text, nullable=True)
    opcionais = Column(Text, nullable=True)
    link = Column(String(500), nullable=True)
    destaque = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True, nullable=False)
    last_seen_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "external_id": self.external_id,
            "source": self.source,
            "nome": self.nome,
            "marca": self.marca,
            "versao": self.versao,
            "ano": self.ano,
            "km": self.km,
            "preco": self.preco,
            "combustivel": self.combustivel,
            "cambio": self.cambio,
            "cor": self.cor,
            "placa": self.placa,
            "imagens": self._parse_json(self.imagens),
            "descricao": self.descricao,
            "opcionais": self._parse_json(self.opcionais),
            "link": self.link,
            "destaque": self.destaque,
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
