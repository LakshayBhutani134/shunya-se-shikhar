import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import katex from 'katex';

const ProblemsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRefs = useRef({}); // Store refs to DOM elements
  const [selectedFiles, setSelectedFiles] = useState({}); // Store actual file objects
  const [uploadStatus, setUploadStatus] = useState({});
  const [previewURLs, setPreviewURLs] = useState({});
  const [submissionResults, setSubmissionResults] = useState({}); // Store submission results
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [points, setPoints] = useState(() => {
    // Check if we're in a browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const savedPoints = localStorage.getItem('mathTutorPoints');
      return savedPoints ? parseInt(savedPoints, 10) : 0;
    }
    return 0; // Default value for server-side rendering
  }); // Track points earned
  const [pointAnimation, setPointAnimation] = useState(null); // Track point change animation

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mathTutorPoints', points.toString());
    }
  }, [points]);

  const resetProgress = () => {
    if (typeof window !== 'undefined' && window.confirm("Are you sure you want to reset your progress?")) {
      setPoints(0);
      localStorage.setItem('mathTutorPoints', '0');
      // Additional reset operations...
    }
  };

  // Helper function to render LaTeX content safely using dangerouslySetInnerHTML
  const renderMathContent = (text) => {
    if (!text) return null;
    
    try {
      // Replace $...$ with rendered HTML
      let processedText = text;
      
      // Handle block math ($$...$$)
      const blockMathRegex = /\$\$(.*?)\$\$/gs;
      processedText = processedText.replace(blockMathRegex, (match, equation) => {
        const html = katex.renderToString(equation, {
          displayMode: true,
          throwOnError: false
        });
        return `<div class="katex-block">${html}</div>`;
      });
      
      // Handle inline math ($...$)
      const inlineMathRegex = /\$(.*?)\$/g;
      processedText = processedText.replace(inlineMathRegex, (match, equation) => {
        const html = katex.renderToString(equation, {
          displayMode: false,
          throwOnError: false
        });
        return html;
      });
      
      return <div dangerouslySetInnerHTML={{ __html: processedText }} />;
    } catch (err) {
      console.error('Error rendering math:', err);
      return <div>{text}</div>;
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/get-questions', {
          params: { level: Math.max(Math.floor(points/20) + 1, 1) },
        });
        console.log(points);
        setQuestions(response.data);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle file selection for a specific question
  const handleFileSelect = (e, questionId) => {
    const file = e.target.files[0];
    if (file) {
      console.log(`File selected for question ${questionId}:`, file.name);
      
      // Store the actual file object
      setSelectedFiles(prev => ({
        ...prev,
        [questionId]: file
      }));

      // Generate a preview URL for the selected file
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewURLs((prev) => ({
          ...prev,
          [questionId]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload for a specific question
  const handleUpload = async (questionId) => {
    const file = selectedFiles[questionId];
    if (!file) {
      alert('Please select a file first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('question_id', questionId);

      console.log('Uploading file:', file.name);
      
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [questionId]: 'File uploaded successfully!',
      }));
      console.log('Upload response:', response.data);
    } catch (err) {
      console.error('Error uploading file:', err);
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [questionId]: 'Failed to upload file',
      }));
    }
  };

  // Submit all solutions and check answers
  const handleSubmitAllSolutions = async () => {
    if (Object.keys(selectedFiles).length === 0) {
      alert("Please upload solutions first");
      return;
    }

    setIsSubmitting(true);
    setSubmissionResults({});
    
    const results = {};
    let pointsChange = 0; // Track points earned/lost in this submission
    
    try {
      // Submit each uploaded solution
      for (const [index, file] of Object.entries(selectedFiles)) {
        const question = questions[index];
        console.log(question);
        const questionId = question["Question ID"];
        
        // If we don't have a question ID, skip
        if (!questionId) {
          results[index] = { error: "Missing question ID" };
          continue;
        }
        
        const parsedId = parseInt(questionId.split('-')[1], 10);
        console.log(parsedId);
        
        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('problem_id', questionId);
        formData.append('user_id', '1'); // Replace with actual user ID
        
        try {
          // Use the submit endpoint
          const response = await axios.post(
            `http://localhost:5000/problems/${parsedId}/submit`, 
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          console.log(response)
          // Store the result
          results[index] = {
            success: true,
            data: response.data,
            answerText: response.data.model_output?.extracted_answer || "Answer processed",
            // isCorrect: response.data.model_output?.is_correct
          };
          
          // Update points based on correctness
          if (response.data.model_output?.final_output.includes("**PARTIALLY CORRECT**")) {
            console.log("Yes", response.data.model_output)
            pointsChange += 7; // Add 10 points for correct answer
          }
          else if (response.data.model_output?.final_output.includes("**MATCHES**")) {
            console.log("Yes", response.data.model_output)
            pointsChange += 5; // Add 10 points for correct answer
          }
          else if (response.data.model_output?.final_output.includes("**CORRECT**") && response.data.model_output?.final_output.includes("**MATCHES**")) {
            console.log("Yes", response.data.model_output)
            pointsChange += 10; // Add 10 points for correct answer
          }
          else {
            console.log("No", response.data.model_output)
            pointsChange -= 3; // Subtract 3 points for wrong answer
          }
          
        } catch (err) {
          console.error(`Error submitting solution for question ${questionId}:`, err);
          results[index] = { 
            success: false, 
            error: err.response?.data?.error || "Failed to submit solution" 
          };
        }
      }
      
      // Update total points after processing all answers
      setPoints(prevPoints => prevPoints + pointsChange);
      
    } finally {
      setSubmissionResults(results);
      setIsSubmitting(false);
      
      // Show point change animation
      if (pointsChange !== 0) {
        setPointAnimation({
          value: pointsChange,
          isPositive: pointsChange > 0
        });
        
        // Clear animation after 2 seconds
        setTimeout(() => {
          setPointAnimation(null);
        }, 2000);
      }
    }
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="problems-container">
      <h1>Math Problems</h1>

      <div className="points-display" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px 0 20px',
        padding: '10px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '18px'
      }}>
        <span>Your Score: </span>
        <span style={{ 
          marginLeft: '10px',
          fontWeight: 'bold',
          color: points >= 0 ? '#4caf50' : '#f44336',
          fontSize: '22px'
        }}>
          {points} points
        </span>
        <button
          onClick={resetProgress}
          style={{
            marginLeft: '20px',
            padding: '5px 10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Reset Progress
        </button>
      </div>

      {pointAnimation && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: pointAnimation.isPositive ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
            color: 'white',
            fontWeight: 'bold',
            animation: 'fadeInOutUp 2s forwards',
            zIndex: 1000
          }}
        >
          {pointAnimation.isPositive ? '+' : ''}{pointAnimation.value} points
        </div>
      )}

      {questions.map((question, index) => (
        <div key={index} className="question-card" style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          backgroundColor: '#fff',
          color: 'black',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>{renderMathContent(question.Problem)}</h3>
          <p><strong>Difficulty:</strong> {question.Level}</p>
          <p><strong>Type:</strong> {question.Type}</p>

          {/* File Upload Section */}
          <div className="upload-section" style={{
            border: '2px dashed #3498db',
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            backgroundColor: '#f8f9fa',
          }}>
            <h3>Upload Your Solution</h3>

            <input
              type="file"
              onChange={(e) => handleFileSelect(e, index)}
              accept="image/*"
              style={{ display: 'none' }}
              ref={(el) => (fileInputRefs.current[index] = el)}
            />

            {previewURLs[index] ? (
              <div style={{ marginBottom: '15px' }}>
                <img
                  src={previewURLs[index]}
                  alt="Solution preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
                <button
                  onClick={() => fileInputRefs.current[index]?.click()}
                  style={{
                    display: 'block',
                    margin: '10px 0',
                    padding: '5px 10px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Change Image
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRefs.current[index]?.click()}
                style={{
                  width: '100%',
                  padding: '40px 0',
                  backgroundColor: '#e0f2fe',
                  border: '2px dashed #3498db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#black',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                Click to Select a Solution Image
              </button>
            )}

            {uploadStatus[index] && (
              <div style={{
                color: uploadStatus[index].includes('successfully') ? 'green' : 'red',
                margin: '10px 0',
                padding: '10px',
                backgroundColor: uploadStatus[index].includes('successfully') ? '#e8f5e9' : '#fbe9e7',
                borderRadius: '4px',
              }}>
                {uploadStatus[index]}
              </div>
            )}

            {/* Show submission result for this question if available */}
            {submissionResults[index] && (
              <div style={{
                margin: '15px 0',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: submissionResults[index].success ? 
                  (submissionResults[index].isCorrect ? '#e8f5e9' : '#fff3e0') : 
                  '#fbe9e7',
                border: `1px solid ${submissionResults[index].success ? 
                  (submissionResults[index].isCorrect ? '#4caf50' : '#ff9800') : 
                  '#f44336'}`
              }}>
                <h4 style={{ margin: '0 0 10px 0' }}>
                  {submissionResults[index].success ? 
                    (
                        submissionResults[index].isCorrect ? 
                      (
                        // <>
                        submissionResults[index].data?.model_output['final_output']
                        // {/* {setPoints((prevPoints) => prevPoints + 10)}
                        // </> */}
                    ): 
                      (
                        // <>
                        submissionResults[index].data?.model_output['final_output']
                        // {setPoints((prevPoints) => prevPoints - 5)}
                        // </>
                    )) : 
                    'Error checking answer'}
                </h4>
                
                {submissionResults[index].success ? (
                  <>
                    <p><strong>Your answer:</strong> {submissionResults[index].answerText}</p>
                    {submissionResults[index].data?.model_output?.feedback && (
                      <p><strong>Feedback:</strong> {submissionResults[index].data.model_output.feedback}</p>
                    )}
                    {/* Show correct answer if wrong */}
                    {!submissionResults[index].isCorrect && question.solution && (
                      <div>
                        <p><strong>Correct answer:</strong></p>
                        {renderMathContent(question.solution)}
                      </div>
                    )}
                  </>
                ) : (
                  <p>{submissionResults[index].error}</p>
                )}
              </div>
            )}

            <button
              onClick={() => handleUpload(index)}
              disabled={!selectedFiles[index]}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: selectedFiles[index] ? '#3498db' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: selectedFiles[index] ? 'pointer' : 'not-allowed',
                marginTop: '15px',
                fontSize: '16px',
              }}
            >
              Upload Solution
            </button>
          </div>
        </div>
      ))}
      
      {/* Submit all solutions button */}
      <div style={{
        margin: '30px 0', 
        padding: '20px',
        backgroundColor: '#f0f8ff',
        borderRadius: '8px',
        textAlign: 'center',
        border: '1px solid #3498db'
      }}>
        <button
          onClick={handleSubmitAllSolutions}
          disabled={isSubmitting || Object.keys(selectedFiles).length === 0}
          style={{
            padding: '15px 30px',
            backgroundColor: isSubmitting || Object.keys(selectedFiles).length === 0 ? '#ccc' : '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting || Object.keys(selectedFiles).length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {isSubmitting ? 'Checking Answers...' : 'Check All Answers'}
        </button>
        
        <p style={{ marginTop: '10px', color: '#666' }}>
          Submit all your solutions to check your answers
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInOutUp {
          0% { transform: translateY(20px); opacity: 0; }
          20% { transform: translateY(0); opacity: 1; }
          80% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ProblemsPage;