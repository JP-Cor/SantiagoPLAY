import json
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).parent
DATA_FILE = ROOT / "data.js"
FLAGS_DIR = ROOT / "assets" / "flags"


def country_codes():
    source = DATA_FILE.read_text(encoding="utf-8")
    payload = source.split("window.EDU_DATA = ", 1)[1]
    data, _end = json.JSONDecoder().raw_decode(payload)
    countries = data["countries"]
    codes = {}
    for country, _capital, _continent, emoji in countries:
        code = "".join(chr(ord(char) - 0x1F1E6 + ord("a")) for char in emoji)
        if len(code) != 2 or not code.isalpha():
            raise ValueError(f"Código ISO inválido para {country}: {emoji!r}")
        codes[code.lower()] = country
    return codes


def download(code):
    destination = FLAGS_DIR / f"{code}.png"
    if destination.exists() and destination.stat().st_size:
        return "existing"
    request = Request(
        f"https://flagcdn.com/w320/{code}.png",
        headers={"User-Agent": "EduJuegos-Costa-Rica/6"},
    )
    try:
        with urlopen(request, timeout=30) as response:
            data = response.read()
    except (HTTPError, URLError) as error:
        raise RuntimeError(f"No se pudo descargar {code}: {error}") from error
    if not data:
        raise RuntimeError(f"FlagCDN devolvió una imagen vacía para {code}")
    destination.write_bytes(data)
    return "downloaded"


def main():
    codes = country_codes()
    FLAGS_DIR.mkdir(parents=True, exist_ok=True)
    downloaded = existing = 0
    for code in sorted(codes):
        if download(code) == "downloaded":
            downloaded += 1
        else:
            existing += 1
    missing = [code for code in codes if not (FLAGS_DIR / f"{code}.png").is_file()]
    if missing:
        raise RuntimeError(f"Faltan banderas: {', '.join(missing)}")
    print(f"{len(codes)} banderas verificadas ({downloaded} descargadas, {existing} existentes).")


if __name__ == "__main__":
    try:
        main()
    except (OSError, RuntimeError, ValueError) as error:
        print(f"Error: {error}", file=sys.stderr)
        raise SystemExit(1)
