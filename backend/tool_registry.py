from mockFunctions import *

tool_map = {
    "getStudentInfo": getStudentInfo,
    "getAppliedPrograms": getAppliedPrograms,
    "checkCapEligibility": checkCapEligibility,
    "checkGraduationEligibility": checkGraduationEligibility,
    "checkFailedCourses": checkFailedCourses,
    "checkErasmusApplication": checkErasmusApplication
}

def run_tool_by_name(call_str: str):
    try:
        prefix = "call "
        if not call_str.startswith(prefix):
            return "❌ Geçersiz çağrı formatı."

        # Örn: call checkCapEligibility("u0002")
        inner = call_str[len(prefix):]  # checkCapEligibility("u0002")
        func_name = inner.split("(")[0]
        arg = inner.split("(")[1].split(")")[0].replace("\"", "").replace("'", "")

        func = tool_map.get(func_name)
        if not func:
            return f"❌ Tanımsız fonksiyon: {func_name}"

        return func(arg)

    except Exception as e:
        return f"⚠️ Tool çağrısı hatalı: {str(e)}"
