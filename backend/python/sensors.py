import RPi.GPIO as GPIO
import PCF8591 as ADC
import time, math, json, sys, signal

PERIODE = 3 #secondes entre deux mesures
DHTPIN = 17
CANAL_TEMPERATURE = 1

GPIO.setmode(GPIO.BCM)


def lire_canal(canal):
    ADC.read(canal)
    return ADC.read(canal)


def temperature():
    valeur = lire_canal(CANAL_TEMPERATURE)
    Vr = 5 * float(valeur) / 255
    if Vr <= 0 or Vr >= 5:
        return None #si la valeur est hors de la plage
    Rt = 10000 * Vr / (5 - Vr)
    temp = 1 / ((math.log(Rt / 10000) / 3950) + (1 / (273.15 + 25)))
    return round(temp - 273.15, 1)


def lire_humidite(tentatives=2):
    """Le DHT11 échoue souvent : on réessaie, en respectant ~1 s entre deux lectures."""
    for i in range(tentatives):
        resultat = read_dht11_dat()
        if resultat:
            humidite, _ = resultat     #on ignore la température du capteur d'humidité
            return float(humidite)
        if i < tentatives - 1:
            time.sleep(1)
    print("DHT11 : lecture échouée", file=sys.stderr)
    return None


def arreter(signum, frame):
    # Node envoie SIGTERM en tuant le processus : KeyboardInterrupt n'est pas levé
    GPIO.cleanup()
    sys.exit(0)


def main():
    ADC.setup(0x48)
    signal.signal(signal.SIGTERM, arreter)
    signal.signal(signal.SIGINT, arreter)

    prochaine = time.monotonic()
    while True:
        mesure = {"temp": temperature(), "hum": lire_humidite()}
        print(json.dumps(mesure), flush=True)

        prochaine += PERIODE
        time.sleep(max(0, prochaine - time.monotonic()))


if __name__ == '__main__':
    main()