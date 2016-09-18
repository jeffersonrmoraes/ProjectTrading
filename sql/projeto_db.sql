--
-- Database: `projeto`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `it_negociacoes`
--

CREATE TABLE `it_negociacoes` (
  `negocio_id` int(11) UNSIGNED NOT NULL,
  `mercadoria_name` varchar(255) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `tipomercadoria` varchar(255) NOT NULL,
  `preco` double NOT NULL,
  `quantidade` int(10) UNSIGNED NOT NULL,
  `tiponegociacao` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dados da tabela `it_negociacoes`
--

INSERT INTO `it_negociacoes` (`negocio_id`, `mercadoria_name`, `descricao`, `tipomercadoria`, `preco`, `quantidade`, `tiponegociacao`) VALUES
(1,  'FeijÃ£o', 'alimentÃ­cio', 'GrÃ£o', 14.5, 2, 'Compra'),
(2,  'Arroz', 'alimentÃ­cio', 'GrÃ£o', 15, 1, 'Compra'),
(3,  'Farinha de Trigo', 'alimentÃ­cio', 'Farinha', 5, 1, 'Venda'),
(4,  'Leite', 'alimentÃ­cio', 'Bebida', 3, 10, 'Compra');


--
-- Indexes for table `it_negociacoes`
--
ALTER TABLE `it_negociacoes`
ADD PRIMARY KEY (`negocio_id`);



--
-- AUTO_INCREMENT for table `it_negociacoes`
--
ALTER TABLE `it_negociacoes`
  MODIFY `negocio_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
