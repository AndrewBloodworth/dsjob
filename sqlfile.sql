
SELECT
  id,
FROM (
  SELECT
    id,
    out_of_stock,
    image, 
    ROW_NUMBER() OVER (PARTITION BY id ORDER BY inserted DESC) AS rownum
  FROM
    triggeredmail.ann_taylor.products )
WHERE
  rownum = 1 
  AND out_of_stock = false 
  AND (
    image = 'https://anninc.scene7.com/is/image/AN/imageService?$fullBpdp$' 
    OR image = 'https://anninc.scene7.com/is/image/AN/imageService?wid=920&qlt=90&op_sharpen=1'
    )