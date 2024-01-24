// import fetch from 'isomorphic-unfetch'
import { GoogleForm } from '../types'
import {
  OTHER_OPTION,
  OTHER_OPTION_RESPONSE
} from '../hooks/utils/useCustomOptionField'
import React, { useRef, useState } from 'react'

export const GOOGLE_FORMS_URL = 'https://docs.google.com/forms/d'

export const formatQuestionName = (id: string) => {
  if (id.includes(OTHER_OPTION_RESPONSE)) {
    return `entry.${id.replace(
      `-${OTHER_OPTION}-${OTHER_OPTION_RESPONSE}`,
      ''
    )}.${OTHER_OPTION_RESPONSE}`
  }

  return `entry.${id}`
}

// export const submitToGoogleForms = async (
//   form: GoogleForm,
//   formData: object
// ): Promise<boolean> => {
//   const urlParams = new URLSearchParams()
//   Object.keys(formData).forEach((key) => {
//     if (formData[key]) {
//       if (formData[key].constructor === Array) {
//         formData[key].forEach((answer: string) => {
//           urlParams.append(formatQuestionName(key), answer)
//         })
//       } else {
//         urlParams.append(formatQuestionName(key), formData[key])
//       }
//     }
//   })

//   let fetchedResult = null

//   try {
//     fetchedResult = await fetch(
//       `${GOOGLE_FORMS_URL}/${
//         form.action
//       }/formResponse?submit=Submit&${urlParams.toString()}`,
//       {
//         method: 'GET',
//         mode: 'no-cors',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         }
//       }
//     )
//   } catch (err) {
//     console.log('error caught', err)
//   }

//   console.log(`fetchedResult`, fetchedResult)

//   const wasSuccessful =
//     (fetchedResult?.ok &&
//       fetchedResult.status < 300 &&
//       fetchedResult.status >= 200) ??
//     false

//   return wasSuccessful
// }

export const submitToGoogleForms = async (
  form: GoogleForm,
  formData: object
): Promise<any> => {
  const urlParams = new URLSearchParams()
  Object.keys(formData).forEach((key) => {
    if (formData[key]) {
      if (formData[key].constructor === Array) {
        formData[key].forEach((answer: string) => {
          urlParams.append(formatQuestionName(key), answer)
        })
      } else {
        urlParams.append(formatQuestionName(key), formData[key])
      }
    }
  })

  const fetchContent = {
    url: `${GOOGLE_FORMS_URL}/${
      form.action
    }/formResponse?submit=Submit&${urlParams.toString()}`,

    method: 'GET',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  // const Form = ({ children }: any) => {
  //   return (
  //     <form
  //       id='my-form'
  //       target='my-response-iframe'
  //       action={`${fetchContent.url}`}
  //       method='get'
  //     >
  //       {children}
  //     </form>
  //   )
  // }

  // const FormIFrame = () => {
  //   return <iframe id='my-response-iframe' name='my-response-iframe'></iframe>
  // }

  const runFormSubmission = () => {
    const formRef = useRef(null)
    const iFrameRef = useRef(null)
    const [submitted, setSubmitted] = useState(false)
    // useEffect(() => {
    //   if (formRef && formRef?.current) {
    //     ;(formRef.current as any).target = 'my-response-iframe'
    //     ;(formRef.current as any).requestSubmit()
    //   }
    // }, [formRef])

    const script = () => {
      if (!submitted && formRef && formRef?.current) {
        ;(formRef.current as any).target = 'my-response-iframe'
        ;(formRef.current as any).requestSubmit()
        setSubmitted(true)
      }
      if (submitted && iFrameRef && iFrameRef?.current) {
        ;(iFrameRef.current as any).onload = function () {
          console.log('Successfully submitted')
        }
      }
    }

    return (
      <div style={{ visibility: 'hidden' }}>
        <form
          id='my-form'
          ref={formRef}
          target='my-response-iframe'
          action={`${fetchContent.url}`}
          method='get'
          style={{ visibility: 'hidden' }}
        >
          <input style={{ visibility: 'hidden' }} type='submit'></input>
        </form>
        <iframe
          style={{ visibility: 'hidden' }}
          id='my-response-iframe'
          ref={iFrameRef}
          name='my-response-iframe'
        ></iframe>
        {script()}
      </div>
    )
  }
  return runFormSubmission
}
