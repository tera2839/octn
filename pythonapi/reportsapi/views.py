from rest_framework.views import APIView
from django.http import HttpResponse
from jinja2 import Environment, FileSystemLoader
import pandas as pd
from io import BytesIO
import os

from xhtml2pdf import pisa

from pyhanko.sign import signers
from pyhanko.sign.general import load_cert_from_pemder, load_private_key_from_pemder
from pyhanko.sign.signers import PdfSignatureMetadata, PdfSigner
from pyhanko.sign.fields import SigFieldSpec
from pyhanko_certvalidator.registry import SimpleCertificateStore
from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter


class ReceiptPDFView(APIView):
    def post(self, request):
        data = request.data
        items = data.get("items", [])
        df = pd.DataFrame(items)

        env = Environment(loader=FileSystemLoader("templates"))
        template = env.get_template("recept.html")
        html_str = template.render(title="領収書", items=df.to_dict(orient="records"))

        pdf_io = BytesIO()
        pisa_status = pisa.CreatePDF(html_str, dest=pdf_io)
        if pisa_status.err:
            return HttpResponse("PDF生成に失敗しました", status=500)

        pdf_io.seek(0)
        signed_pdf = self.sign_pdf(pdf_io.getvalue())

        return HttpResponse(
            signed_pdf,
            content_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="signed_receipt.pdf"'}
        )

    def sign_pdf(self, pdf_bytes: bytes, key_passphrase: bytes | None = None) -> bytes:
        pdf_reader_stream = BytesIO(pdf_bytes)
        writer = IncrementalPdfFileWriter(pdf_reader_stream)

        key_path = r"C:/Users/souma/Desktop/octn/key.pem"
        cert_path = r"C:/Users/souma/Desktop/octn/cert.pem"

        if not os.path.exists(key_path):
            raise FileNotFoundError(f"秘密鍵ファイルが見つかりません: {key_path}")
        if not os.path.exists(cert_path):
            raise FileNotFoundError(f"証明書ファイルが見つかりません: {cert_path}")

        signing_cert = load_cert_from_pemder(cert_path)
        signing_key = load_private_key_from_pemder(key_path, passphrase=key_passphrase)

        signer = signers.SimpleSigner(
            signing_cert=signing_cert,
            signing_key=signing_key,
            cert_registry=SimpleCertificateStore(),
        )

        signature_meta = PdfSignatureMetadata(field_name="Signature1")

        field_spec = SigFieldSpec(
            sig_field_name="Signature1",
            box=(350, 50, 550, 150)  # 署名欄の位置（pt単位）
        )

        pdf_signer = PdfSigner(
            signature_meta,
            signer=signer,
            new_field_spec=field_spec
        )

        signed_stream = BytesIO()
        pdf_signer.sign_pdf(writer, output=signed_stream)

        signed_stream.seek(0)
        return signed_stream.read()


ReceiptPDF = ReceiptPDFView.as_view()
