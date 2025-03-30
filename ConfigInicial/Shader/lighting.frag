#version 330 core

struct Material
{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

struct Light
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;

out vec4 color;

uniform vec3 viewPos;
uniform Material material;
uniform Light light;
uniform Light light2;
uniform sampler2D texture_diffusse;

void main()
{
    vec3 norm = normalize(Normal);
    vec3 viewDir = normalize(viewPos - FragPos);
    
    // --- Cálculo de iluminación para la primera luz ---
    vec3 lightDir = normalize(light.position - FragPos);
    vec3 ambient = light.ambient * material.diffuse;
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diff * material.diffuse;
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = light.specular * (spec * material.specular);

    // --- Cálculo de iluminación para la segunda luz ---
    vec3 lightDir2 = normalize(light2.position - FragPos);
    vec3 ambient2 = light2.ambient * material.diffuse;
    float diff2 = max(dot(norm, lightDir2), 0.0);
    vec3 diffuse2 = light2.diffuse * diff2 * material.diffuse;
    vec3 reflectDir2 = reflect(-lightDir2, norm);
    float spec2 = pow(max(dot(viewDir, reflectDir2), 0.0), material.shininess);
    vec3 specular2 = light2.specular * (spec2 * material.specular);

    // --- Sumamos las contribuciones de ambas luces ---
    vec3 result = (ambient + diffuse + specular) + (ambient2 + diffuse2 + specular2);
    
    // Aplicamos la textura
    color = vec4(result, 1.0f) * texture(texture_diffusse, TexCoords);
}
