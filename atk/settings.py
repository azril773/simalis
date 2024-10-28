import os
from pathlib import Path
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-u%e7ke)f9#-f6#==u5=!f9bg_697e@3+$tik9u-%5x9#inh(m+simalis@patOche'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    "*"
]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.humanize',
   'django.contrib.staticfiles',
    # 'mathfilters',
    "import_export",
    "atkapp",
]

CORS_ALLOWED_ORIGINS = []
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'atk.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'atk.wsgi.application' 


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  
        'NAME': 'atk',  
        'USER':'root',  
        'PASSWORD':'b@iklaH',  
        'HOST':'localhost',  
        'PORT':'3306'
    },
    'atk_pas':{
        'ENGINE': 'django.db.backends.mysql',  
        'NAME': 'atk_pas',  
        'USER':'root',  
        'PASSWORD':'b@iklaH',  
        'HOST':'localhost',  
        'PORT':'3306'
    },
    'atk_pat':{
        'ENGINE': 'django.db.backends.mysql',  
        'NAME': 'atk_pat',  
        'USER':'root',  
        'PASSWORD':'b@iklaH',  
        'HOST':'localhost',  
        'PORT':'3306'
    },
    'atk_crb':{
        'ENGINE': 'django.db.backends.mysql',  
        'NAME': 'atk_crb',  
        'USER':'root',  
        'PASSWORD':'b@iklaH',  
        'HOST':'localhost',  
        'PORT':'3306'
    },
    'atk_chd':{
        'ENGINE': 'django.db.backends.mysql',  
        'NAME': 'atk_chd',  
        'USER':'root',  
        'PASSWORD':'b@iklaH',  
        'HOST':'localhost',  
        'PORT':'3306'
    },
    'atk_grt':{
        'ENGINE': 'django.db.backends.mysql',  
        'NAME': 'atk_grt',  
        'USER':'root',  
        'PASSWORD':'b@iklaH',  
        'HOST':'localhost',  
        'PORT':'3306'
    },
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    # {
    #     'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    # },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'id'

TIME_ZONE = 'Asia/Jakarta'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'
# STATIC_ROOT = "/home/itguy/apps/simalis-crb/static/"
STATICFILES_DIRS = [
    'static/'
]
# STATICFILES_DIRS = ("/home/manager/pajak_site/pajak/static", )

LOGIN_REDIRECT_URL = 'dispatch'
LOGIN_URL = 'login'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'