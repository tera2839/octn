from rest_framework.views import APIView
from django.http import HttpResponse
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import pandas as pd
from io import BytesIO

class ReceiptPDFView(APIView):
    def post(self, request):
        data = request.data
        items = data.get("items", [])
        df = pd.DataFrame(items)

        # Jinja2でHTMLレンダリング
        env = Environment(loader=FileSystemLoader("templates"))
        template = env.get_template("recept.html")
        html_str = template.render(title="領収書", items=df.to_dict(orient="records"))

        # HTML → PDF変換（WeasyPrint）
        pdf_io = BytesIO()
        HTML(string=html_str).write_pdf(pdf_io)
        pdf_io.seek(0)

        return HttpResponse(pdf_io, content_type="application/pdf")

ReceiptPDF = ReceiptPDFView.as_view()
