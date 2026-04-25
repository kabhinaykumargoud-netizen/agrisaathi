import os
from typing import Optional
from .config import settings

def get_llm_response(prompt: str, system_prompt: str = "You are AgriSaathi, an expert AI agricultural advisor. Be concise, helpful, and friendly.", image_base64: Optional[str] = None) -> str:
    # 1. Try Groq (Fastest)
    if settings.GROQ_API_KEY:
        try:
            from groq import Groq
            client = Groq(api_key=settings.GROQ_API_KEY)
            
            # Use Vision model if image is provided
            model_name = "llama-3.2-11b-vision-preview" if image_base64 else "llama-3.3-70b-versatile"
            
            user_content = prompt
            if image_base64:
                # Ensure the base64 string includes the data URI scheme if not present
                prefix = "" if image_base64.startswith("data:image") else "data:image/jpeg;base64,"
                user_content = [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"{prefix}{image_base64}"}}
                ]

            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                model=model_name,
                temperature=0.7,
                max_tokens=1024,
            )
            return chat_completion.choices[0].message.content
        except Exception:
            pass

    # 3. Fallback
    return "I am currently running in offline mode. Please check your AI API keys (Groq or Gemini) in the .env file."
