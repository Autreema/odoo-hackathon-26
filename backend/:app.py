from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from config import Config

app = Flask(__name__)

# Load configuration
app.config.from_object(Config)

# Initialize MySQL
mysql = MySQL(app)


# ==========================
# HOME API
# ==========================
@app.route("/")
def home():
    return "Welcome to TransitOps Backend"


# ==========================
# GET ALL VEHICLES
# ==========================
@app.route("/vehicles", methods=["GET"])
def get_vehicles():

    cursor = mysql.connection.cursor()

    cursor.execute("SELECT * FROM vehicles")

    vehicles = cursor.fetchall()

    cursor.close()

    return jsonify(vehicles)


# ==========================
# GET VEHICLE BY ID
# ==========================
@app.route("/vehicles/<int:vehicle_id>", methods=["GET"])
def get_vehicle(vehicle_id):

    cursor = mysql.connection.cursor()

    cursor.execute(
        "SELECT * FROM vehicles WHERE vehicle_id = %s",
        (vehicle_id,)
    )

    vehicle = cursor.fetchone()

    cursor.close()

    if vehicle:
        return jsonify(vehicle)
    else:
        return jsonify({"message": "Vehicle not found"}), 404


# ==========================
# ADD NEW VEHICLE
# ==========================
@app.route("/vehicles", methods=["POST"])
def add_vehicle():

    try:
        data = request.get_json()

        cursor = mysql.connection.cursor()

        query = """
        INSERT INTO vehicles
        (
            registration_number,
            vehicle_name,
            vehicle_type,
            max_load_capacity,
            odometer,
            acquisition_cost,
            status
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        """

        values = (
            data["registration_number"],
            data["vehicle_name"],
            data["vehicle_type"],
            data["max_load_capacity"],
            data["odometer"],
            data["acquisition_cost"],
            data["status"]
        )

        cursor.execute(query, values)
        mysql.connection.commit()

        cursor.close()

        return jsonify({"message": "Vehicle Added Successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ==========================
# UPDATE VEHICLE
# ==========================
@app.route("/vehicles/<int:vehicle_id>", methods=["PUT"])
def update_vehicle(vehicle_id):

    try:
        data = request.get_json()

        cursor = mysql.connection.cursor()

        query = """
        UPDATE vehicles
        SET
            registration_number=%s,
            vehicle_name=%s,
            vehicle_type=%s,
            max_load_capacity=%s,
            odometer=%s,
            acquisition_cost=%s,
            status=%s
        WHERE vehicle_id=%s
        """

        values = (
            data["registration_number"],
            data["vehicle_name"],
            data["vehicle_type"],
            data["max_load_capacity"],
            data["odometer"],
            data["acquisition_cost"],
            data["status"],
            vehicle_id
        )

        cursor.execute(query, values)
        mysql.connection.commit()

        if cursor.rowcount == 0:
            cursor.close()
            return jsonify({"message": "Vehicle not found"}), 404

        cursor.close()

        return jsonify({"message": "Vehicle Updated Successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ==========================
# DELETE VEHICLE
# ==========================
@app.route("/vehicles/<int:vehicle_id>", methods=["DELETE"])
def delete_vehicle(vehicle_id):

    try:
        cursor = mysql.connection.cursor()

        cursor.execute(
            "DELETE FROM vehicles WHERE vehicle_id = %s",
            (vehicle_id,)
        )

        mysql.connection.commit()

        if cursor.rowcount == 0:
            cursor.close()
            return jsonify({"message": "Vehicle not found"}), 404

        cursor.close()

        return jsonify({"message": "Vehicle Deleted Successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ==========================
# RUN FLASK APP
# ==========================
if __name__ == "__main__":
    app.run(debug=True)
