import json

with open("student_db.json", "r", encoding="utf-8") as f:
    db = json.load(f)

def getStudentInfo(uid): return db.get(uid, {})

def checkCapEligibility(uid):
    agno = db[uid]["agno"]
    return {"AGNO": agno, "ÇAP Uygun mu?": agno >= 2.72}

def checkGraduationEligibility(uid):
    kredi = db[uid]["kredi"]
    return {"Tamamlanan Kredi": kredi, "Mezuniyet Uygunluğu": kredi >= 150}

def checkFailedCourses(uid):
    failed = db[uid].get("failed", [])
    return {"Başarısız Dersler": failed, "Başarısız Ders Var mı?": len(failed) > 0}

def getAppliedPrograms(uid):
    return {"Başvurulan Programlar": db[uid].get("applications", [])}

def checkErasmusApplication(uid):
    apps = db[uid].get("applications", [])
    return {"Erasmus Başvurusu Var mı?": "Erasmus" in apps}
