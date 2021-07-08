import collections.abc
from typing import (
    Deque, Dict, FrozenSet, List, Optional, Sequence, Set, Tuple, Union, Optional
)

def to_camel_case(snake_str):
    components = snake_str.split('_')
    # We capitalize the first letter of each component except the first one
    # with the 'title' method and join them together.
    return components[0] + ''.join(x.title() for x in components[1:])


def delete_key(d, key: str):
    return {i:d[i] for i in d if i!=key}

def dedup_by_key(items: List[dict], key: str):
    done = set()
    result = []
    for d in items:
        if d[key] not in done:
            done.add(d[key])  # note it down for further iterations
            result.append(d)
    return result

def update_nested(d, u):
    print('d check', d)
    for k, v in u.items():
        if u[k] and isinstance(v, dict):
            d[k] = update_nested(d.get(k) or {}, v)
        elif u[k]:
            d[k] = v
    return d