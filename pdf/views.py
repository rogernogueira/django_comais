from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import json
import os
from django.conf import settings

def converter_pdf(request):
    """View para exibir o formulário de conversão de PDF"""
    return render(request, 'pdf/converter_pdf.html')

@csrf_exempt
def upload_pdf(request):
    """View para processar o upload e conversão do PDF usando a API real"""
    if request.method == 'POST' and request.FILES.get('file'):
        
        try:
            # Obter o arquivo PDF
            pdf_file = request.FILES['file']
            
            # Obter parâmetros do formulário
            page_range = request.POST.get('page_range', '0')
            force_ocr = request.POST.get('force_ocr', 'false')
            paginate_output = request.POST.get('paginate_output', 'false')
            output_format = request.POST.get('output_format', 'markdown')
            extract_images = request.POST.get('extract_images', 'true')
            
            # Preparar dados para a API
            files = {
                'file': (pdf_file.name, pdf_file.read(), 'application/pdf')
            }
            
            data = {
                'page_range': page_range,
                'force_ocr': force_ocr,
                'paginate_output': paginate_output,
                'output_format': output_format,
                'extract_images': extract_images,  # Extrair imagens
                'image_quality': 'high'    # Qualidade das imagens
            }
            
            # URL da API de conversão de PDF
            api_url = 'http://192.168.105.8:8007/marker/upload'
            
            # Fazer requisição para a API
            response = requests.post(api_url, files=files, data=data)
            
            if response.status_code == 200:
                # API retornou sucesso
                api_response = response.json()
                
                # Verificar se a API retornou sucesso real
                if not api_response.get('success', False):
                    # API retornou erro interno
                    error_msg = api_response.get('error', 'Erro desconhecido na API')
                    return JsonResponse({
                        'success': False,
                        'message': f'Erro na conversão: {error_msg}'
                    }, status=500)
                
                # Gerar nome de arquivo único
                import time
                timestamp = int(time.time())
                original_name = pdf_file.name.split('.')[0]
                
                # Definir extensão correta baseada no formato de saída
                extension_map = {
                    'markdown': 'md',
                    'html': 'html',
                    'json': 'json',
                    'chunks': 'txt'
                }
                extension = extension_map.get(output_format, 'txt')
                
                filename = f"converted_{original_name}_{timestamp}.{extension}"
                file_path = os.path.join(settings.MEDIA_ROOT, 'converted_pdfs', filename)
                
                # Criar diretório se não existir
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                
                # Processar conteúdo retornado pela API
                content = api_response.get('output', '')
                images = api_response.get('images', {})
                
                if not content:
                    # Se a API não retornou conteúdo, retornar erro
                    return JsonResponse({
                        'success': False,
                        'message': 'A API não retornou conteúdo convertido. Verifique se o PDF contém texto legível.'
                    }, status=500)
                
                # Processar imagens se existirem
                if images:
                    # Substituir referências de imagens no conteúdo com base64 inline
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
                
                # Salvar conteúdo final
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                # Construir URL completa para download
                file_url = f"{settings.MEDIA_URL}converted_pdfs/{filename}"
                
                # URL para visualização
                view_url = f"/pdf/view/{filename}/"
                
                return JsonResponse({
                    'success': True,
                    'message': f'PDF convertido com sucesso para {output_format.upper()}',
                    'file_url': file_url,
                    'view_url': view_url,
                    'filename': filename,
                    'format': output_format,
                    'api_response': api_response
                })
            else:
                # API retornou erro HTTP
                try:
                    error_response = response.json()
                    error_msg = error_response.get('error', response.text)
                except:
                    error_msg = response.text
                
                return JsonResponse({
                    'success': False,
                    'message': f'Erro na API de conversão: {response.status_code} - {error_msg}'
                }, status=500)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Erro interno: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Nenhum arquivo enviado'
    }, status=400)

def view_converted_file(request, filename):
    """View para visualizar o conteúdo convertido"""
    try:
        # Caminho do arquivo
        file_path = os.path.join(settings.MEDIA_ROOT, 'converted_pdfs', filename)
        
        # Verificar se o arquivo existe
        if not os.path.exists(file_path):
            return HttpResponse("Arquivo não encontrado", status=404)
        
        # Ler o conteúdo do arquivo
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Determinar o formato baseado na extensão
        extension = filename.split('.')[-1].lower()
        
        # Renderizar template apropriado baseado no formato
        if extension == 'html':
            # Para HTML, retornar diretamente o conteúdo
            return HttpResponse(content, content_type='text/html')
        elif extension == 'md':
            # Para Markdown, renderizar em template com suporte a markdown
            return render(request, 'pdf/view_markdown.html', {
                'filename': filename,
                'content': content,
                'format': 'markdown'
            })
        elif extension == 'json':
            # Para JSON, formatar bonito
            try:
                json_data = json.loads(content)
                formatted_json = json.dumps(json_data, indent=2, ensure_ascii=False)
                return render(request, 'pdf/view_json.html', {
                    'filename': filename,
                    'content': formatted_json,
                    'format': 'json'
                })
            except:
                # Se não for JSON válido, mostrar como texto
                return render(request, 'pdf/view_text.html', {
                    'filename': filename,
                    'content': content,
                    'format': 'text'
                })
        else:
            # Para outros formatos (txt, etc.)
            return render(request, 'pdf/view_text.html', {
                'filename': filename,
                'content': content,
                'format': 'text'
            })
            
    except Exception as e:
        return HttpResponse(f"Erro ao visualizar arquivo: {str(e)}", status=500)

def download_converted_file(request, filename):
    """View para download do arquivo convertido"""
    try:
        # Caminho do arquivo
        file_path = os.path.join(settings.MEDIA_ROOT, 'converted_pdfs', filename)
        
        # Verificar se o arquivo existe
        if not os.path.exists(file_path):
            return HttpResponse("Arquivo não encontrado", status=404)
        
        # Determinar content type baseado na extensão
        extension = filename.split('.')[-1].lower()
        content_type_map = {
            'md': 'text/markdown',
            'html': 'text/html',
            'json': 'application/json',
            'txt': 'text/plain'
        }
        content_type = content_type_map.get(extension, 'text/plain')
        
        # Abrir arquivo e retornar como download
        with open(file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type=content_type)
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
            
    except Exception as e:
        return HttpResponse(f"Erro ao baixar arquivo: {str(e)}", status=500)
