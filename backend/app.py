import logging
import os

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

from .config import BASE_DIR, DATABASE_URL, ENABLE_SCHEDULER, SCHEDULER_INTERVAL_MINUTES
from .database import Base, get_session_factory
from .models import Vehicle
from .services import VehicleScraper, VehicleSyncService

load_dotenv()

logging.basicConfig(level=getattr(logging, os.getenv("LOG_LEVEL", "INFO")), format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger(__name__)


def create_app():
    app = Flask(__name__)
    CORS(app)

    SessionLocal, engine = get_session_factory()
    Base.metadata.create_all(engine)

    @app.route("/health")
    def health_check():
        return jsonify({"status": "ok", "database": DATABASE_URL})

    @app.route("/api/carros")
    def api_carros():
        with SessionLocal() as session:
            carros = session.query(Vehicle).filter(Vehicle.is_available.is_(True)).all()
            return jsonify([carro.to_dict() for carro in carros])

    @app.route("/api/carro/<string:id>")
    def api_carro(id):
        with SessionLocal() as session:
            carro = session.query(Vehicle).filter(Vehicle.id == id).first()
            if carro is None:
                return jsonify({"error": "Carro não encontrado"}), 404
            return jsonify(carro.to_dict())

    @app.route("/api/sync")
    def trigger_sync():
        try:
            result = sync_service.sync()
            return jsonify({"status": "ok", "result": result})
        except Exception:
            logger.exception("Vehicle synchronization failed")
            return jsonify({
                "status": "error",
                "message": "Synchronization failed"
            }), 500

    @app.route("/api/status")
    def status():
        with SessionLocal() as session:
            total = session.query(Vehicle).count()
            available = session.query(Vehicle).filter(Vehicle.is_available.is_(True)).count()
            unavailable = session.query(Vehicle).filter(Vehicle.is_available.is_(False)).count()
            return jsonify({"total": total, "available": available, "unavailable": unavailable})

    @app.route("/assets/<path:filename>")
    def serve_assets(filename):
        return send_from_directory(os.path.join(BASE_DIR, "frontend", "dist", "assets"), filename)

    @app.route("/<path:filename>")
    def serve_static(filename):
        file_path = os.path.join(BASE_DIR, "frontend", "dist", filename)
        if os.path.exists(file_path):
            return send_from_directory(os.path.join(BASE_DIR, "frontend", "dist"), filename)
        return send_from_directory(os.path.join(BASE_DIR, "frontend", "dist"), "index.html")

    @app.route("/")
    def serve_index():
        return send_from_directory(os.path.join(BASE_DIR, "frontend", "dist"), "index.html")

    if ENABLE_SCHEDULER:
        from apscheduler.schedulers.background import BackgroundScheduler

        scheduler = BackgroundScheduler()
        scheduler.add_job(trigger_sync, "interval", minutes=SCHEDULER_INTERVAL_MINUTES, id="vehicle-sync")
        scheduler.start()
        logger.info("Scheduler ativo com intervalo de %s minutos", SCHEDULER_INTERVAL_MINUTES)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.getenv("PORT", "5000")))
