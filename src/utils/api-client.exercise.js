function client(endpoint, customConfig = {}) {
  const url = `${process.env.REACT_APP_API_URL}`
  const config = {
    method: 'GET',
    ...customConfig,
  }
  return window.fetch(`${url}/${endpoint}`, config).then(async res => {
    return await res.json()
  })
}

export {client}

/*






























💰 spoiler alert below...



























































const config = {
    method: 'GET',
    ...customConfig,
  }
*/
