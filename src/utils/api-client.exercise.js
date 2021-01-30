function client(endpoint, customConfig = {}) {
  const url = `${process.env.REACT_APP_API_URL}`
  const config = {
    method: 'GET',
    ...customConfig,
  }
  return window.fetch(`${url}/${endpoint}`, config).then(async res => {
    const data = await res.json()
    if (res.ok) return data
    return Promise.reject(data)
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
