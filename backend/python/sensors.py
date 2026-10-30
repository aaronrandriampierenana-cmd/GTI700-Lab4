import RPi.GPIO as GPIO
from humid import read_dht11_dat
import time, json, sys, signal

PERIODE = 3 #secondes entre deux mesures


def lire_humidite(tentatives=2):
    """Le DHT11 échoue souvent : on réessaie, en respectant ~1 s entre deux lectures."""
    for i in range(tentatives):
        resultat = read_dht11_dat()
        if resultat:
            humidite, _ = resultat     #on ignore la température
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
    signal.signal(signal.SIGTERM, arreter)
    signal.signal(signal.SIGINT, arreter)

    prochaine = time.monotonic()
    while True:
        mesure = {"hum": lire_humidite()}
        print(json.dumps(mesure), flush=True)

        prochaine += PERIODE
        time.sleep(max(0, prochaine - time.monotonic()))


if __name__ == '__main__':
    main()
