import json, random, time

temp, hum = 21.5, 50.0

while True:
    temp = min(25, max(18, temp + random.uniform(-0.3, 0.3)))
    hum = min(70, max(30, hum + random.uniform(-1, 1)))

    mesure = {
        "temp": round(temp, 1),
        "hum": None if random.random() < 0.1 else round(hum, 1),
    }
    print(json.dumps(mesure), flush=True)
    time.sleep(3)