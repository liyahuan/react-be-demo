import { useState } from 'react';
export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');


  const handleButtonClick =() => {
  }

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e:any) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(error);
    }
  }

  function handleTextareaChange(e:any) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button onClick={handleButtonClick} disabled={ answer.length === 0 ||
          status === 'submitting'}>
          Submit 
        </button>
        {answer !== null &&
          <p className="Error">
            {answer}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer:any) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error(answer));
      } else {
        resolve('');
      }
    }, 1500);
  });
}
