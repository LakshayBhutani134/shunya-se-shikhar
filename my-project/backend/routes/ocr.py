from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from typing import TypedDict
import re
from langchain_core.messages import HumanMessage, SystemMessage
import base64

load_dotenv()

class State(TypedDict):
    img_path: str
    ocr_output: str
    system_ans: str
    final_output: str

llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro-exp-03-25")

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def ocr_node(state: State):
    img_path = state['img_path']

    encoded_image = encode_image(img_path)

    messages = [
        SystemMessage('''
                INSTRUCTION: PARSE TEXT ONLY - DO NOT SOLVE
                Your task is to accurately transcribe the handwritten text in the image without analyzing, solving, or providing any steps toward a solution.
                Rules:
                1. Transcribe EXACTLY what is written, including any errors, notation, or formatting
                2. Preserve mathematical symbols, numbers, and special characters
                3. Use [illegible] for any text you cannot read with confidence
                4. Maintain the text structure and line breaks where possible
                5. Do NOT correct errors in the handwritten content
                6. Do NOT solve any problems, equations, or questions in the text
                7. Do NOT provide explanations, suggestions, or commentary
                After transcription, begin your response with "Thus the parsed text is:" followed by the verbatim transcription.
                IMPORTANT: No matter how simple the problem might appear, you are ONLY permitted to transcribe the text, not solve it.
        '''),
        HumanMessage(
            content=[
                {"type": "image_url", "image_url": f"data:image/jpeg;base64,{encoded_image}"}
            ]
        )
    ]


    result = llm.invoke(messages)

    result = re.sub(r'\\\\', r'\\', result.content)
    return {'ocr_output': result}

def compare_node(state: State):
    human_ans = state['ocr_output']
    system_ans = state['system_ans']

    result = llm.invoke([
        HumanMessage(f'''As an answer evaluator, your task is to compare a human's solution approach and final answer with the system's answer.
        Human Answer:
        {human_ans}

        System Answer (Correct Solution):
        {system_ans}

        Please analyze both answers and provide an evaluation based on the following criteria:

        1. Solution Approach Correctness: Is the human's methodology or approach to solving the problem valid? Identify any conceptual errors, shortcuts, or alternative valid methods used.

        2. Final Answer Correctness: Does the human's final answer match the system's answer? Consider numerical values, units, and any acceptable variations or formats.

        3. Detailed Feedback: Provide specific feedback on:
        - What the human did correctly
        - Any errors in understanding, calculation, or methodology
        - Suggestions for improvement if needed

        Conclude with a clear verdict: "The human's solution approach is [CORRECT/PARTIALLY CORRECT/INCORRECT] and the final answer is [MATCHES/DOES NOT MATCH] the system's answer.
        Respond like a human.
        "''')
    ])

    return {'final_output': result.content}

builder = StateGraph(State)

builder.add_node("ocr", ocr_node)
builder.add_node("compare", compare_node)

builder.add_edge(START, "ocr")
builder.add_edge("ocr", "compare")
builder.add_edge("compare", END)

graph = builder.compile()