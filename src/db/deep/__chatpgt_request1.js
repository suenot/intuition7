async ({ deep, require }) => {
  const React = require('react');
  const { useState } = React;
  const { Box, Text, Avatar, Wrap, WrapItem, Editable, EditablePreview, EditableInput, EditableTextarea, Center, Flex, Divider } = require('@chakra-ui/react');
  const asyncFileTypeId = await deep.id("@deep-foundation/core", "AsyncFile");
  const assetNameTypeId = await deep.id("@suenot/asset", "Name");
  const assetDescriptionTypeId = await deep.id("@suenot/asset", "Description");
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
            type_id: { _id: ["@suenot/asset", "Description"] }
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
    const nameData = deep.minilinks.query({
      to_id: link.id,
      type_id: assetNameTypeId
    });
    const assetDescriptionData = deep.minilinks.query({
      to_id: link.id,
      type_id: assetDescriptionTypeId
    });
    const tickerData = deep.minilinks.query({
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

    const name = nameData?.[0]?.value?.value || '';
    const ticker = tickerData?.[0]?.value?.value || '';
    const description = assetDescriptionData?.[0]?.value?.value || "";
    console.log({data});
    console.log({fileData, file, name, ticker, avatarData, avatar, src});


    const [assetName, setAssetName] = useState(name);
    const [assetTicker, setAssetTicker] = useState(ticker);
    const [assetDescription, setAssetDescription] = useState(description);
    const [assetFile, setAssetFile] = useState(file);
    const [assetAvatar, setAssetAvatar] = useState(avatar);
    const [assetSrc, setAssetSrc] = useState(src);
    return <div>
      <Box maxW='sm' minW='sm' w='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='4' backgroundColor='white'>
        <div>
          <Flex
            align="center"
            justify="center"
          >
            <Avatar size='2xl' name='' src={src} mb='1' />
          </Flex>
        </div>
        <Wrap>
          <Editable defaultValue={name} style={{flex: '1 0 auto'}}>
            <EditablePreview />
            <EditableInput />
          </Editable>
        </Wrap>
        <Wrap>
          <Editable defaultValue={ticker}>
            <EditablePreview />
            <EditableInput />
          </Editable>
        </Wrap>
        <Editable defaultValue={description}>
          <EditablePreview />
          <EditableTextarea />
        </Editable>
        <Divider />
        <Editable defaultValue={avatar}>
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Box>
    </div>;
  }
}



I add
```
const [assetName, setAssetName] = useState(name);
const [assetTicker, setAssetTicker] = useState(ticker);
const [assetDescription, setAssetDescription] = useState(description);
const [assetFile, setAssetFile] = useState(file);
const [assetAvatar, setAssetAvatar] = useState(avatar);
const [assetSrc, setAssetSrc] = useState(src);
```
I want use them in Editable. And when changed assetAvatar need recalculate assetSrc.