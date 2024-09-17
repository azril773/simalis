FROM python

WORKDIR /app

# COPY . .
RUN pip install --no-cache-dir --upgrade pip
RUN pip install pdfkit django mysqlclient django-import-export weasyprint




