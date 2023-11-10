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
    const assetFileValue = fileData?.[0]?.id && `/api/file?linkId=${fileData?.[0]?.id}`;
    const assetAvatarValue = avatarData?.[0]?.value?.value;
    const assetAvatarId = avatarData?.[0]?.id;
    // File has more priority than avatar (url)
    const assetSrcValue = assetFileValue || assetAvatarValue || "";

    const assetNameValue = nameData?.[0]?.value?.value || '';
    const assetNameId = nameData?.[0]?.id;
    const assetTickerValue = tickerData?.[0]?.value?.value || '';
    const assetTickerId = tickerData?.[0]?.id;
    const assetDescriptionValue = assetDescriptionData?.[0]?.value?.value || "";
    const assetDescriptionId = assetDescriptionData?.[0]?.id;
    console.log({data});



    const [assetName, setAssetName] = useState(assetNameValue);
    const [assetTicker, setAssetTicker] = useState(assetTickerValue);
    const [assetDescription, setAssetDescription] = useState(assetDescriptionValue);
    const [assetFile, setAssetFile] = useState(assetFileValue);
    const [assetAvatar, setAssetAvatar] = useState(assetAvatarValue);
    const [assetSrc, setAssetSrc] = useState(assetSrcValue);


    return <div>
      <Box maxW='sm' minW='sm' w='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='4' backgroundColor='white'>
        <div>
          <Flex
            align="center"
            justify="center"
          >
            <Avatar size='2xl' name='' src={assetSrc} mb='1' />
          </Flex>
        </div>
        <Editable defaultValue="Insert name" value={assetName} onChange={async (value) => {
          setAssetName(value)
          const { data: [{ link: assetNameLink }] } = await deep.update(
            { link_id: assetNameId },
            { value },
            { table: 'strings', returning: `link { ${deep.selectReturning} }` }
          );
          console.log({assetNameLink});
          deep.minilinks.apply([assetNameLink]);
        }}>
          <EditablePreview />
          <EditableInput />
        </Editable>
        <Editable defaultValue="Insert ticker" value={assetTicker} onChange={async (value) => {
          setAssetTicker(value)
          const { data: [{ link: assetTickerLink }] } = await deep.update(
              { link_id: assetTickerId },
              { value },
              { table: 'strings', returning: `link { ${deep.selectReturning} }` }
            );
            console.log({assetTickerLink});
            deep.minilinks.apply([assetTickerLink]);
        }}>
          <EditablePreview />
          <EditableInput />
        </Editable>
        <Editable defaultValue="Insert description" value={assetDescription} onChange={async (value) => {
            setAssetDescription(value)
            const { data: [{ link: assetDescriptionLink }] } = await deep.update(
              { link_id: assetDescriptionId },
              { value },
              { table: 'strings', returning: `link { ${deep.selectReturning} }` }
            );
            console.log({assetDescriptionLink});
          }}>
          <EditablePreview />
          <EditableTextarea />
        </Editable>
        <Divider />
        <Editable defaultValue="Insert avatar url" value={assetAvatar} onChange={async (value) => {
          setAssetAvatar(value);
          const newSrc = assetFile || value || "";
          setAssetSrc(newSrc);
          const { data: [{ link: assetAvatarLink }] } = await deep.update(
            { link_id: assetAvatarId },
            { value: newSrc },
            { table: 'strings', returning: `link { ${deep.selectReturning} }` }
          );
          console.log({assetAvatarLink});
          deep.minilinks.apply([assetAvatarLink]);
        }}>
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Box>
    </div>;
  }
}