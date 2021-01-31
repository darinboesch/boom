import request from 'request'
import config from "../config.dev"

export const getIssue = async issueId => {
  const url = `${config.jira.url}/issue/${issueId}`
  return new Promise((resolve, reject) => {
    const req = request(url, (err, response, bdy) => {
      if (err) return reject(err, response, bdy)
      const body = JSON.parse(bdy)
      resolve({
        id: body.id,
        key: body.key,
        parent: body.customField_10371 || null
      })
    })
  })
}

export const getIssues = async issueIds => {
  try {
    return Promise.all(issueIds.map(getIssue));
  } catch (err) {
    console.error(err);
  }
}
