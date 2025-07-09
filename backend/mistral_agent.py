from llama_cpp import Llama

# GGUF model yolu
llm = Llama(
    model_path="models/mistral-7b-instruct-v0.1.Q4_K_M.gguf",
    n_ctx=2048,
    n_threads=6
)

def predict_tool_call(message: str, student_id: str) -> str:
    prompt = f"""<s>[INST]
    Sen bir üniversite öğrenci işleri asistanısın. Kullanıcının mesajına göre hangi tool fonksiyonunu çağıracağını seçmelisin.

    Araçlar:
    - getStudentInfo(student_id): Öğrencinin ad, bölüm, agno, danışman bilgilerini verir.
    - getAppliedPrograms(student_id): Öğrencinin başvurduğu programları listeler.
    - checkCapEligibility(student_id): Öğrencinin AGNO'suna göre ÇAP (çift anadal) başvurusu yapıp yapamayacağını belirler.
    - checkGraduationEligibility(student_id): Öğrencinin toplam kredisine göre mezun olup olamayacağını kontrol eder.
    - checkFailedCourses(student_id): Öğrencinin kaldığı ders var mı diye kontrol eder.
    - checkErasmusApplication(student_id): Erasmus başvurusu yapıp yapmadığını gösterir.

    Kullanıcı mesajı: "{message}"
    Öğrenci numarası: "{student_id}"

    Yalnızca aşağıdaki formatta yanıt üret:
    call <function_name>("student_id")
    Ekstra açıklama, yorum veya başka metin yazma.
    [/INST]"""

    response = llm(prompt, max_tokens=100, stop=["</s>"])
    return response["choices"][0]["text"].strip()
