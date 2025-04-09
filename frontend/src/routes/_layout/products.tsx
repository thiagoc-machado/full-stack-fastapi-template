import {
  Container,
  EmptyState,
  Flex,
  Heading,
  Table,
  VStack,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { FiSearch } from "react-icons/fi"
import { z } from "zod"

import { ProductsService } from "@/client"
import ProductActionsMenu from "@/components/Products/ProductActionsMenu"
import AddProduct from "@/components/Products/AddProduct"
import PendingItems from "@/components/Pending/PendingItems"
import EditProduct from "@/components/Products/EditProduct"
import DeleteProduct from "@/components/Products/DeleteProduct"
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination"

const productsSearchSchema = z.object({
  page: z.number().catch(1),
})

const PER_PAGE = 5

function getProductsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      ProductsService.readProducts({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["products", { page }],
  }
}

export const Route = createFileRoute("/_layout/products")({
  component: Products,
  validateSearch: (search) => productsSearchSchema.parse(search),
})

function ProductsTable() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { page } = Route.useSearch()

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getProductsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const setPage = (page: number) =>
    navigate({
      search: (prev) => ({ ...prev, page }),
    })

  const products = data ?? []

  if (isLoading) return <PendingItems />

  if (products.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiSearch />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>No products found</EmptyState.Title>
            <EmptyState.Description>
              Add a new product to get started
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <>
      <Table.Root size={{ base: "sm", md: "md" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Price</Table.ColumnHeader>
            <Table.ColumnHeader>Quantity</Table.ColumnHeader>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {products.map((product) => (
            <Table.Row key={product.id} opacity={isPlaceholderData ? 0.5 : 1}>
              <Table.Cell>{product.id}</Table.Cell>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>{product.description || "N/A"}</Table.Cell>
              <Table.Cell>{product.price}</Table.Cell>
              <Table.Cell>{product.quantity}</Table.Cell>
              <Table.Cell>{product.category}</Table.Cell>
              <Table.Cell>
              <Flex gap={2}>
              {product.id && (
                  <Flex gap={2}>
                    <EditProduct product={product} />
                    <DeleteProduct id={product.id} />
                  </Flex>
              )}
              </Flex>
            </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex justifyContent="flex-end" mt={4}>
        <PaginationRoot
          count={products.length}
          pageSize={PER_PAGE}
          onPageChange={({ page }) => setPage(page)}
        >
          <Flex>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </Flex>
        </PaginationRoot>
      </Flex>
    </>
  )
}

function Products() {
  return (
    <Container maxW="full">
      <Heading size="lg" pt={12}>
        Products Management
      </Heading>
      <AddProduct />
      <ProductsTable />
    </Container>
  )
}
