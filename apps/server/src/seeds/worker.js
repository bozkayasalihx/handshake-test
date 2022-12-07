const { workerData, parentPort } = require("worker_threads");
const axios = require("axios").default;
const jwt = require("jsonwebtoken");

class Work {
    request(userId) {
        const token = jwt.sign(
            { id: userId, tokenVersion: 0 },
            "f458a57132a1c50ce5064937a10ed33bf27086ae89598daf33fb620d99bdb95b",
            { expiresIn: "7d" }
        );

        const instance = axios.create({
            baseURL: "http://localhost:9000",
            headers: { Authorization: `Bearer ${token}` },
        });

        return instance;
    }

    async makePost() {
        for (let i = 0; i < workerData.data.length; i++) {
            const randomUserId = Math.ceil(Math.random() * 200);
            try {
                await this.request(randomUserId).post(
                    workerData.route,
                    workerData.data[i]
                );
            } catch (err) {
                continue;
            }
        }
    }
}

const worker = new Work();
worker.makePost().catch((err) => {
    console.log("worker thread err", err);
});
