const axios = require('axios');

exports.getHome = async (req, res) => {
  try {
    const overAllCount = await axios(
      'https://api.coronatracker.com/v3/stats/worldometer/global'
    );

    const results = await axios(
      'https://api.coronatracker.com/v3/stats/worldometer/country'
    );

    const limitRes = [];
    for (let i = 0; i <= 10; i++) {
      if (results.data[i].countryCode) limitRes.push(results.data[i]);
    }

    console.log(limitRes);

    res.status(200).render('index', { results: limitRes, count: overAllCount });
  } catch (err) {
    res.status(500).render('notfound', {
      header: 'Ooops',
      message: 'Something went wrong! Please Try again later.'
    });
  }
};

exports.getAffected = async (req, res) => {
  try {
    const overAllCount = await axios(
      'https://api.coronatracker.com/v3/stats/worldometer/global'
    );

    const results = await axios(
      'https://api.coronatracker.com/v3/stats/worldometer/country'
    );

    res.status(200).render('affected', { results, count: overAllCount });
  } catch (err) {
    res.status(500).render('notfound', {
      header: 'Ooops',
      message: 'Something went wrong! Please Try again later.'
    });
  }
};

exports.getCountry = async (req, res) => {
  try {
    const results = await axios(
      'https://api.coronatracker.com/v3/stats/worldometer/country'
    );

    const obj = {};

    for (let result of results.data) {
      if (
        result.countryCode &&
        result.countryCode.toLowerCase() === req.params.countryCode
      ) {
        obj['countryCode'] = result.countryCode.toLowerCase();
        obj['country'] = result.country;
        obj['totalConfirmed'] = result.totalConfirmed;
        obj['totalDeaths'] = result.totalDeaths;
        obj['totalRecovered'] = result.totalRecovered;
        obj['dailyConfirmed'] = result.dailyConfirmed;
        obj['dailyDeaths'] = result.dailyDeaths;
        obj['activeCases'] = result.activeCases;
        obj['totalCritical'] = result.totalCritical;
        obj['totalConfirmedPerMillionPopulation'] =
          result.totalConfirmedPerMillionPopulation;
        obj['deathRate'] = result.FR;
        obj['recoveryRate'] = result.PR;
      }
    }

    return obj.countryCode
      ? res.status(200).render('country', { result: obj })
      : res.status(404).render('notfound', {
          header: 'No Country Found',
          message:
            'The link you entered may be broken or the page may have been removed.'
        });
  } catch (err) {
    res.status(500).render('notfound', {
      header: 'Ooops',
      message: 'Something went wrong! Please Try again later.'
    });
  }
};

exports.checkService = async (req, res, next) => {
  try {
    const service = await axios('https://api.coronatracker.com/health');

    return service.data.status === 'OK'
      ? next()
      : res.status(500).render('notfound', {
          header: 'Service Not Available!',
          message:
            'The service is currently not available! Please Try again later.'
        });
  } catch (err) {
    res.status(500).render('notfound', {
      header: 'Ooops',
      message: 'Something went wrong! Please Try again later.'
    });
  }
};
