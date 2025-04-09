import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { FaPlus } from 'react-icons/fa'
import {
  Button,
  DialogActionTrigger,
  DialogTitle,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'

import { type ProductCreate, ProductsService } from '@/client'
import type { ApiError } from '@/client/core/ApiError'
import useCustomToast from '@/hooks/useCustomToast'
import { handleError } from '@/utils'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from '../ui/dialog'
import { Field } from '../ui/field'

const AddProduct = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ProductCreate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      quantity: 1,
      category: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ProductCreate) =>
      ProductsService.createProduct({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast('Producto creado correctamente.')
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

  const onSubmit: SubmitHandler<ProductCreate> = (data) => {
    mutation.mutate(data)
  }

  return (
    <DialogRoot
      size={{ base: 'xs', md: 'md' }}
      placement='center'
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button my={4}>
          <FaPlus fontSize='16px' />
          Añadir Producto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Crear nuevo producto</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Completa los datos para añadir un nuevo producto.</Text>
            <VStack gap={4}>
              <Field
                required
                invalid={!!errors.name}
                errorText={errors.name?.message}
                label='Nombre'
              >
                <Input
                  id='name'
                  {...register('name', {
                    required: 'El nombre es obligatorio.',
                  })}
                  placeholder='Nombre del producto'
                />
              </Field>

              <Field
                invalid={!!errors.description}
                errorText={errors.description?.message}
                label='Descripción'
              >
                <Input
                  id='description'
                  {...register('description')}
                  placeholder='Descripción'
                />
              </Field>

              <Field
                required
                invalid={!!errors.price}
                errorText={errors.price?.message}
                label='Precio'
              >
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  {...register('price', {
                    required: 'El precio es obligatorio.',
                    min: { value: 0.01, message: 'Debe ser mayor que cero.' },
                  })}
                  placeholder='Precio'
                />
              </Field>

              <Field
                required
                invalid={!!errors.quantity}
                errorText={errors.quantity?.message}
                label='Cantidad'
              >
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

              <Field
                required
                invalid={!!errors.category}
                errorText={errors.category?.message}
                label='Categoría'
              >
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
            <DialogActionTrigger asChild>
              <Button
                variant='subtle'
                colorPalette='gray'
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </DialogActionTrigger>
            <Button
              variant='solid'
              type='submit'
              disabled={!isValid}
              loading={isSubmitting}
            >
              Guardar
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default AddProduct
