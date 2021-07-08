

def to_camel_case(snake_str):
    components = snake_str.split('_')
    # We capitalize the first letter of each component except the first one
    # with the 'title' method and join them together.
    return components[0] + ''.join(x.title() for x in components[1:])


def delete_key(d: str, key: str):
    if d.get(key, None):
        del d[key]
    return d
    