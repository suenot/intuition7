async ({data, deep}) => {
  const itemValue = data?.newLink?.value?.value;
  const fromId = data?.newLink?.from_id;
  const toId = data?.newLink?.to_id;
  const fromValue = (await deep.select(fromId)).data?.[0]?.value?.value || 0;
  const toValue = (await deep.select(toId)).data?.[0]?.value?.value || 0;
  const fromValueResult = fromValue - itemValue;
  const toValueResult = toValue + itemValue;
  const updateFromResult = await deep.update(
    {
      link_id: fromId
    },
    {
      value: fromValueResult
    },
    {
      table: 'numbers'
    }
  )
  const updateToResult = await deep.update(
    {
      link_id: toId
    },
    {
      value: toValueResult
    },
    {
      table: 'numbers'
    }
  )

  return {itemValue, fromValue, toValue, fromValueResult, toValueResult, updateFromResult, updateToResult}; 
}