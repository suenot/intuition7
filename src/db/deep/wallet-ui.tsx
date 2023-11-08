async ({ deep, require }) => {
  const React = require('react');
  const { Box, Text, Avatar, Wrap } = require('@chakra-ui/react');
  const assetTypeId = await deep.id("@suenot/portfolios", "Asset");
  const baseTypeId = await deep.id("@suenot/portfolios", "Base");
  const asyncFileTypeId = await deep.id("@deep-foundation/core", "AsyncFile");
  const assetNameTypeId = await deep.id("@suenot/portfolios", "AssetName");
  const assetTickerTypeId = await deep.id("@suenot/portfolios", "AssetTicker");
  
  return ({ fillSize, style, link }) => {
    const amount = link?.value?.value || 0;
    const data = deep.useDeepQuery({
        _or: [
          // get async file (avatar)
          {
            to: {
              type_id: assetTypeId,
              in: {
                type_id: baseTypeId,
                from_id: link.id
              }
            },
            type_id: asyncFileTypeId
          },
          // get ticker
          {
            to: {
              type_id: assetTypeId,
              in: {
                type_id: baseTypeId,
                from_id: link.id
              }
            },
            type_id: assetTickerTypeId
          },
        ]
      }
    );
    const avatars = deep.minilinks.query({
      to: {
        type_id: assetTypeId,
        in: {
          type_id: baseTypeId,
          from_id: link.id
        }
      },
      type_id: asyncFileTypeId
    });
    const ticker = deep.minilinks.query({
      to: {
        type_id: assetTypeId,
        in: {
          type_id: baseTypeId,
          from_id: link.id
        }
      },
      type_id: assetTickerTypeId
    });
    console.log({data});
    console.log({avatars, name, ticker});
    return <div>
      <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='4' backgroundColor='white'>
        <Wrap>
          <Avatar size='2xl' name='' src={`/api/file?linkId=${avatars?.[0]?.id}`} mb='1' />{' '}
          <Text>{name?.[0]?.value?.value}</Text>
          <Text>{amount} {ticker?.[0]?.value?.value}</Text>
        </Wrap>
      </Box>
    </div>;
  }
}