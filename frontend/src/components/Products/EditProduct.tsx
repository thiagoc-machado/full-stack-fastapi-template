import {
  Button,
  ButtonGroup,
  DialogActionTrigger,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { FaExchangeAlt } from 'react-icons/fa'

import { type ApiError, type Product, ProductsService } from '@/client'
import useCustomToast from '@/hooks/useCustomToast'
import { handleError } from '@/utils'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Field } from '../ui/field'

interface EditProductProps {
  product: Product
}

const EditProduct = ({ product }: EditProductProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Product, 'id'>>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      quantity: product.quantity,
      category: product.category,
    },
  })

  const mutation = useMutation({
    mutationFn: ({ id, ...data }: Product) =>
      ProductsService.updateProduct({ id, requestBody: data }),
    onSuccess: () => {
      showSuccessToast('Producto actualizado correctamente.')
      reset()
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const onSubmit: SubmitHandler<Omit<Product, 'id'>> = (data) => {
    console.log('Enviando ID:', product.id)
    mutation.mutate({ ...data, id: product.id })
  }

  return (
    <DialogRoot
      size={{ base: 'xs', md: 'md' }}
      placement='center'
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant='ghost'>
          <FaExchangeAlt fontSize='16px' />
          Editar producto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Editar producto</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Actualiza los datos del producto.</Text>
            <VStack gap={4}>
              <Field required invalid={!!errors.name} errorText={errors.name?.message} label='Nombre'>
                <Input
                  id='name'
                  {...register('name', {
                    required: 'El nombre es obligatorio',
                  })}
                  placeholder='Nombre'
                />
              </Field>

              <Field invalid={!!errors.description} errorText={errors.description?.message} label='Descripción'>
                <Input id='description' {...register('description')} placeholder='Descripción' />
              </Field>

              <Field required invalid={!!errors.price} errorText={errors.price?.message} label='Precio'>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  {...register('price', {
                    required: 'El precio es obligatorio.',
                    min: { value: 0.01, message: 'Debe ser mayor que 0.' },
                  })}
                  placeholder='Precio'
                />
              </Field>

              <Field required invalid={!!errors.quantity} errorText={errors.quantity?.message} label='Cantidad'>
                <Input
                  id='quantity'
                  type='number'
                  {...register('quantity', {
                    required: 'La cantidad es obligatoria.',
                    min: { value: 1, message: 'Debe ser al menos 1.' },
                  })}
                  placeholder='Cantidad'
                />
              </Field>

              <Field required invalid={!!errors.category} errorText={errors.category?.message} label='Categoría'>
                <Input
                  id='category'
                  {...register('category', {
                    required: 'La categoría es obligatoria.',
                  })}
                  placeholder='Categoría'
                />
              </Field>
            </VStack>
          </DialogBody>

          <DialogFooter gap={2}>
            <ButtonGroup>
              <DialogActionTrigger asChild>
                <Button variant='subtle' colorPalette='gray' disabled={isSubmitting}>
                  Cancelar
                </Button>
              </DialogActionTrigger>
              <Button variant='solid' type='submit' loading={isSubmitting}>
                Guardar
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default EditProduct
