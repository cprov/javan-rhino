import LaunchpadTeams from '../lib/openid/teams';
import Macaroons from '../lib/openid/macaroons.js';
import conf from '../configure.js';
import openid from 'openid';

openid['LaunchpadTeams'] = LaunchpadTeams;
openid['Macaroons'] = Macaroons;

const createRelyingParty = (/**teams, cid**/) => {
  const extensions = [
    new openid.SimpleRegistration({
      'nickname' : true,
      'email' : true,
      'fullname' : true,
      'language' : true
    })
  ];

  /** TODO
  if (teams) {
    extensions.push(
      new openid.LaunchpadTeams({
        'teams': teams
      })
    );
  }

  // TODO macaroon refresh
  if (cid) {
    extensions.push(
      new openid.Macaroons({
        'cid': cid
      })
    );
  }
   **/

  return new openid.RelyingParty(
    conf.get('OPENID:VERIFY_URL'),
    conf.get('OPENID:REALM'),
    false, // Use stateless verification
    false, // Strict mode
    extensions
  );
};

let rp = createRelyingParty();

const authenticate = (req, res) => {
  const identifier = conf.get('UBUNTU_SSO_URL');

  // Resolve identifier, associate, and build authentication URL
  rp.authenticate(identifier, false, (error, authUrl) => {
    if (error) {
      // TODO auth failure view
      res.send('Authentication failed: ' + error.message);
    }
    else if (!authUrl) {
      // TODO auth failure view
      res.send('Authentication failed');
    }
    else {
      res.redirect(authUrl);
    }
  });
};

const verify = (req, res) => {
  rp.verifyAssertion(req, (error, result) => {
    // TODO handle error
    if (!error) {
      req.session.name = result.fullname;
      req.session.teams = result.teams;
    }

    res.redirect('/');
  });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      // TODO handle error
    }
    res.redirect('/');
  });
};

export { authenticate, verify, logout, createRelyingParty };