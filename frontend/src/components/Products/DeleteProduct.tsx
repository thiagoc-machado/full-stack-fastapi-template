import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Button, DialogTitle, Text } from '@chakra-ui/react'
import { FiTrash2 } from 'react-icons/fi'

import { ProductsService } from '@/client'
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from '@/components/ui/dialog'
import useCustomToast from '@/hooks/useCustomToast'

interface DeleteProductProps {
  id: string
}

const DeleteProduct = ({ id }: DeleteProductProps) => {
  console.log('ID recebido:', id)
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  const mutation = useMutation({
    mutationFn: () => ProductsService.deleteProduct,
    onSuccess: () => {
      showSuccessToast('El producto fue eliminado correctamente.')
      setIsOpen(false)
    },
    onError: () => {
      showErrorToast('Ocurrió un error al eliminar el producto.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const onSubmit = () => {
    mutation.mutate(id)
  }

  return (
    <DialogRoot
      size={{ base: 'xs', md: 'md' }}
      placement='center'
      role='alertdialog'
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' colorPalette='red'>
          <FiTrash2 fontSize='16px' />
          Eliminar producto
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogCloseTrigger />
          <DialogHeader>
            <DialogTitle>Eliminar producto</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>
              Este producto se eliminará permanentemente. ¿Estás seguro? No podrás deshacer esta acción.
            </Text>
          </DialogBody>
          <DialogFooter gap={2}>
            <DialogActionTrigger asChild>
              <Button variant='subtle' colorPalette='gray' disabled={isSubmitting}>
                Cancelar
              </Button>
            </DialogActionTrigger>
            <Button variant='solid' colorPalette='red' type='submit' loading={isSubmitting}>
              Eliminar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default DeleteProduct
