async ({ deep, require }) => {
  const React = require('react');
  const { Box, Text, Avatar, Wrap, WrapItem } = require('@chakra-ui/react');
  const asyncFileTypeId = await deep.id("@deep-foundation/core", "AsyncFile");
  const assetNameTypeId = await deep.id("@suenot/portfolios", "AssetName");
  const assetTickerTypeId = await deep.id("@suenot/portfolios", "AssetTicker");
  
  return ({ fillSize, style, link }) => {
    const data = deep.useDeepQuery({
        _or: [
          {
            to_id: link.id,
            type_id: { _id: ["@deep-foundation/core", "AsyncFile"] }
          },
          {
            to_id: link.id,
            type_id: { _id: ["@suenot/portfolios", "AssetName"] }
          },
          {
            to_id: link.id,
            type_id: { _id: ["@suenot/portfolios", "AssetTicker"] }
          }
        ]
      }
    );
    const avatars = deep.minilinks.query({
      to_id: link.id,
      type_id: asyncFileTypeId
    });
    const name = deep.minilinks.query({
      to_id: link.id,
      type_id: assetNameTypeId
    });
    const ticker = deep.minilinks.query({
      to_id: link.id,
      type_id: assetTickerTypeId
    });
    console.log({data});
    console.log({avatars, name, ticker});
    return <div>
      <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='4' backgroundColor='white'>
        <Wrap>
          <Avatar size='2xl' name='' src={`/api/file?linkId=${avatars?.[0]?.id}`} mb='1' />{' '}
          <Text>{name?.[0]?.value?.value}</Text>
          <Text>{ticker?.[0]?.value?.value}</Text>
        </Wrap>
      </Box>
    </div>;
  }
}