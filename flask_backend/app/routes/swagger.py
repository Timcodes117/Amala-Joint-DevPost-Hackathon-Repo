from flask import Blueprint, jsonify, send_file, current_app
import os
import yaml

swagger_bp = Blueprint('swagger', __name__)

@swagger_bp.route('/api/docs/swagger.yaml')
def swagger_yaml():
    """Serve the Swagger YAML file"""
    try:
        yaml_path = os.path.join(current_app.root_path, 'swagger.yaml')
        if os.path.exists(yaml_path):
            return send_file(yaml_path, mimetype='application/x-yaml')
        else:
            return jsonify({'error': 'Swagger YAML file not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Error serving Swagger YAML: {str(e)}'}), 500

@swagger_bp.route('/api/docs/swagger.json')
def swagger_json():
    """Convert and serve the Swagger YAML as JSON"""
    try:
        yaml_path = os.path.join(current_app.root_path, 'swagger.yaml')
        if os.path.exists(yaml_path):
            with open(yaml_path, 'r', encoding='utf-8') as file:
                yaml_content = yaml.safe_load(file)
            return jsonify(yaml_content)
        else:
            return jsonify({'error': 'Swagger YAML file not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Error converting Swagger YAML: {str(e)}'}), 500

@swagger_bp.route('/api/docs')
def swagger_ui():
    """Serve Swagger UI HTML"""
    try:
        html_content = '''
<!DOCTYPE html>
<html>
<head>
    <title>Amala Joint API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; background: #fafafa; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/api/docs/swagger.yaml',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                tryItOutEnabled: true,
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
                onComplete: function() {
                    console.log('Swagger UI loaded successfully');
                },
                onFailure: function(data) {
                    console.error('Swagger UI failed to load:', data);
                }
            });
        };
    </script>
</body>
</html>
        '''
        return html_content, 200, {'Content-Type': 'text/html'}
    except Exception as e:
        return jsonify({'error': f'Error serving Swagger UI: {str(e)}'}), 500

