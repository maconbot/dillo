from application import app
from application import db
from application.modules.admin.model import Setting

def load_settings():
    """Load the application settings from the Settings table in the database
    in the app config.
    """

    settings_list = ['logo_alt', 'logo_image', 'title', 'title_html', 'tagline', 'footer',
    'credits']

    for setting_name in settings_list:
        s = Setting.query.filter_by(name=setting_name).first()
        if not s:
            # If the queried setting is missing, create one with empty value
            s = Setting(name=setting_name,
                value="",
                data_type='str')
            db.session.add(s)
            db.session.commit()

        config_key = 'SETTINGS_' + setting_name.upper()
        app.config[config_key] = s.value

    # Extra update for the logo image path
    app.config['SETTINGS_LOGO_IMAGE'] = '/static/images/' + app.config['SETTINGS_LOGO_IMAGE']