#!/usr/bin/env python3
import os
import json
import csv
import argparse


def args():
    ap = argparse.ArgumentParser()
    ap.add_argument("language", help="The language code. Ex: en-US, fr")
    return vars(ap.parse_args())


def convertCSV(file):
    obj = {}
    with open(file, "r") as f:
        reader = csv.reader(f)
        for row in reader:
            # skip if no localized string
            if row[1] == "":
                continue
            else:
                obj[row[0]] = {
                    "message": row[1],
                    "description": row[2]
                }
    return obj


def main():
    opts = args()
    # read path
    path = os.path.join("extension", "_locales", opts["language"])
    if not os.path.exists(path):
        os.mkdir(path)
    i18n = convertCSV(os.path.join(path, "messages.csv"))
    with open(os.path.join(path, "messages.json"), "w") as f:
        f.write(json.dumps(i18n))
        print("Wrote to messages.json in {0}".format(path))


if __name__ == "__main__":
    main()
