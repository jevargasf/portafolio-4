# portafolio-4

Front end para e-commerce de tienda de artículos musicales escrita en JavaScript, CSS y HTML. Se utiliza la biblioteca Bootstrap para el diseño gráfico de los componentes del sitio. La base de datos de los productos de la tienda está almacenada en un archivo json que es consumido por el front end a través de API Fetch. La tienda permite simular una compra hasta antes del pago de los productos. Los productos se van almacenando en un carrito de compras, el cual permite agregar, eliminar, sumar y quitar productos del carrito. Los productos seleccionados son almacenados en el File System del navegador para conservar el estado de la compra aunque se recargue la página.

El sitio tiene una página principal donde se despliegan los productos a través de los componentes cards y modal de Bootstrap. Adicionalmente, el sitio tiene una página para revisar y editar el carrito de compras, una página de información de la empresa y una página de formulario de contacto. Adicionalmente, el sitio tiene un navbar para navegar entre estas páginas, un botón para desplegar formulario de inicio de sesión y registro (no funcional) y un botón para desplegar el estado actual del carrito a través de un componente offcanvas de Bootstrap.
