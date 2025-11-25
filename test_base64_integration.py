"""
Script de teste para demonstrar como o base64 das imagens é incorporado no markdown
"""

# Exemplo de como a API retornaria dados com imagens
api_response_example = {
    "format": "markdown",
    "output": """# Documento com Imagens

Este é um documento PDF que contém imagens.

## Primeira seção

Aqui está o texto antes da primeira imagem.

![](_page_0_Picture_0.jpeg)

## Segunda seção

Texto após a primeira imagem.

![](_page_1_Picture_1.jpeg)

## Conclusão

Fim do documento.
""",
    "images": {
        "_page_0_Picture_0.jpeg": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
        "_page_1_Picture_1.jpeg": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    },
    "success": True
}

def process_images_in_content(content, images):
    """Processa as imagens e incorpora base64 inline no conteúdo"""
    if images:
        for image_name, image_data in images.items():
            if image_data.startswith('/9j/'):  # JPEG base64
                try:
                    # Formatar base64 para data URL
                    base64_url = f"data:image/jpeg;base64,{image_data}"
                    
                    # Substituir referência no conteúdo com base64 inline
                    content = content.replace(f"![]({image_name})", f"![]({base64_url})")
                    
                except Exception as e:
                    print(f"Erro ao processar imagem {image_name}: {str(e)}")
                    continue
    
    return content

# Testar o processamento
print("=== CONTEÚDO ORIGINAL ===")
print(api_response_example["output"])
print("\n")

print("=== CONTEÚDO PROCESSADO COM BASE64 ===")
processed_content = process_images_in_content(
    api_response_example["output"], 
    api_response_example["images"]
)
print(processed_content)

print("\n=== DETALHES DAS IMAGENS ===")
print(f"Número de imagens: {len(api_response_example['images'])}")
for img_name, img_data in api_response_example["images"].items():
    print(f"Imagem: {img_name}")
    print(f"Tamanho do base64: {len(img_data)} caracteres")
    print(f"Preview base64: {img_data[:50]}...")
    print()
