import random
from src.service.mongo import user_service
from src.service.mongo import matches_service
from src.schema.user import user_model
from src.schema.matches import match_model

class Matcher_Controller():
    def __init__(self):
        pass

    def get_potential_matches(self, user_id): 
        match_list = user_service.get_demo_users(user_id)[:8]
        result = {
            'potentialMatches': match_list,
            'numPotentialMatches': len(match_list)
        }
        return result

    def get_new_matches(self, user_id, oldMatches, numFetch): 
        match_list = user_service.get_demo_users(user_id)
        matches_ids = [match['id'] for match in match_list]
        diff = list(set(matches_ids) - set(oldMatches))
        newMatches = user_service.read_many(diff)
        random.shuffle(newMatches)
        newMatches = newMatches[:numFetch]
        result = {
            'potentialMatches': newMatches,
            'numPotentialMatches': len(newMatches)
        }
        return result

    def submit_match(self, match):
        # write new match to db
        made_match = matches_service.find_match(match)
        print('made match query: ', made_match)

        # if a match exists, add the new matcher to it, otherwise make it
        if made_match: 
            made_match['matchers'] += match.matchers
            made_match['matchers'] = list(set(made_match['matchers']))
            made_match = matches_service.update(made_match)
        else:
            print('making new match')
            made_match = matches_service.create(match.dict())
            print('my new match: ', made_match)

        return made_match

    def respond_to_match(self, matchId: str, response: str, user):
        match = matches_service.find_match_by_users(matchId, user['id'])
        if user['id'] == match['user1']['userId']:
            matchee = match['user1']
            matchee['response'] = response
            match['user1'] = matchee
        elif user['id'] == match['user2']['userId']:
            matchee = match['user2']
            matchee['response'] = response
            match['user2'] = matchee
        else: 
            raise LookupError('invalid match')

        match_result = matches_service.update(match)

        if match['user1']['response'] == 'accept' and match['user2']['response'] == 'accept':
            matchers = user_service.read_many(match['matchers'])
            for matcher in matchers:
                matcher['score'] += 5
                user_service.update(matcher)

        return match_result



matcher_controller = Matcher_Controller()
