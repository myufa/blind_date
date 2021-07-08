import json

content = {
    'stage': 'dev',
    'project_id': 'blind-date-dev-304521'
}

with open('project-metadata.json', 'w') as f:
    json.dump(content, f)

print('\n------------\n USING DEV\n------------\n')
