import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { ServiceImage } from "../../services_images/serviceImage.entity";

export class CreateServiceDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'Manutenção de eletrodoméstico',
        description: 'Nome do serviço prestado pelo usuário provedor.',
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'Faço manutenção em qualquer eletrodoméstico.',
        description: 'Descrição detalhada do serviço oferecido pelo prestador.',
    })
    description: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive({ message: 'O valor do serviço deve ser positivo.' })
    @ApiProperty({
        example: 400,
        description: 'Valor cobrado pelo serviço em reais (BRL). Máximo de 2 casas decimais.',
    })
    price: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'Manutenção',
        description: 'Categoria do serviço prestado.',
    })
    category: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'PE',
        description: 'Sigla do estado onde o serviço é prestado (2 letras).',
    })
    state: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'Recife',
        description: 'Cidade onde o serviço é prestado.',
    })
    city: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'conserto de geladeira',
        description:
            'Palavra-chave ou termo de busca opcional para facilitar pesquisas pelo serviço.',
        required: false,
    })
    search?: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    @ApiProperty({
        type: [ServiceImage],
        description:
            'Lista opcional de imagens relacionadas ao serviço. Cada imagem deve seguir a estrutura da entidade ServiceImage.',
        required: false,
    })
    images?: ServiceImage[];
}
