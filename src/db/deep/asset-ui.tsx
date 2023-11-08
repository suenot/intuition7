async ({ deep, require }) => {
  const React = require('react');
  const { Box, Text, Avatar, Wrap, WrapItem } = require('@chakra-ui/react');
  const asyncFileTypeId = await deep.id("@deep-foundation/core", "AsyncFile");
  const assetNameTypeId = await deep.id("@suenot/asset", "Name");
  const assetTickerTypeId = await deep.id("@suenot/asset", "Ticker");
  const assetAvatarTypeId = await deep.id("@suenot/asset", "Avatar");
  
  return ({ fillSize, style, link }) => {
    const data = deep.useDeepQuery({
        _or: [
          {
            to_id: link.id,
            type_id: { _id: ["@deep-foundation/core", "AsyncFile"] }
          },
          {
            to_id: link.id,
            type_id: { _id: ["@suenot/asset", "Name"] }
          },
          {
            to_id: link.id,
            type_id: { _id: ["@suenot/asset", "Ticker"] }
          },
          {
            to_id: link.id,
            type_id: { _id: ["@suenot/asset", "Avatar"] }
          }
        ]
      }
    );
    const fileData = deep.minilinks.query({
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
    const avatarData = deep.minilinks.query({
      to_id: link.id,
      type_id: assetAvatarTypeId
    });
    const file = fileData?.[0]?.id && `/api/file?linkId=${fileData?.[0]?.id}`;
    const avatar = avatarData?.[0]?.value?.value;
    // File has more priority than avatar (url)
    const src = file || avatar || "";
    console.log({data});
    console.log({fileData, file, name, ticker, avatarData, avatar, src});
    return <div>
      <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='4' backgroundColor='white'>
        <Wrap>
          <Avatar size='2xl' name='' src={src} mb='1' />{' '}
          <Text>{name?.[0]?.value?.value}</Text>
          <Text>{ticker?.[0]?.value?.value}</Text>
        </Wrap>
      </Box>
    </div>;
  }
}