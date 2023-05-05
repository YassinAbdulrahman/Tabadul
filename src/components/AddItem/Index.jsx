import { withTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import {
    Buttoncontainer,
    CancelButton,
    Cancelspan,
    CatogryInput,
    ConfirmButton,
    Confirmspan,
    DeleteIcon,
    DescriptionInput,
    DisplayContainer,
    ErrorLabel,
    Formcontainer,
    FormItem,
    ImagesDiv,
    ItemCatogry,
    ItemDescription,
    ItemHeader,
    ItemImage,
    ItemImageInput,
    ItemInput,
    ItemLocation,
    ItemTitle,
    Itemupload,
    LabelDiv,
    LocationInput,
    Locationoption,
    Pagecontainer,
    PlusDiv,
    Selectoption,
    TitleInput,
    UploadContainer,
    UploadInput,
    Uploadspan,
} from "./AddItem.styled";
import { addItem, auth } from "@/utils/firebase";
import {
    deleteObject,
    getDownloadURL,
    getMetadata,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/utils/firebase";
import Link from "next/link";
import Router from "next/router";
import Image from "next/image";
import thumbnail from "../../../public/thumbnails/default-image.png";

function AddItem({ categoriesList, locationList, t }) {
    const [imagesList, setImagesList] = useState([]);
    const [errorMsg, setErrorMsg] = useState({
        title: "",
        location: "",
        category: "",
        description: "",
        image: "",
    });
    const current = new Date();

    function currentDate() {
        const date = current.getDate().toString().padStart(2, "0");
        const month = (current.getMonth() + 1).toString().padStart(2, "0");
        const year = current.getFullYear();
        return `${date}/${month}/${year}`;
    }

    const [item, setItem] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        image: "",
    });
    function addto(e) {
        e.preventDefault();
        const formatedDate = currentDate();
        const updateItem = {
            ...item,
            time: current.toLocaleTimeString(),
            date: formatedDate,
            image: imagesList,
            userId: auth?.currentUser?.uid,
        };
        let flagIsFilled = validateOnSubmit(updateItem);
        if (flagIsFilled === Object.entries(updateItem).length) {
            addItem(updateItem);
            alert("product has been added!");
            setTimeout(() => {
                Router.push("/Products");
            }, 1000);
        }
    }

    function validateOnSubmit(updateItem) {
        let flag = 0;
        Object.entries(updateItem).forEach(([key, value]) => {
            if (value.length === 0) {
                setErrorMsg((prev) => ({ ...prev, [key]: true }));
            } else {
                setErrorMsg((prev) => ({ ...prev, [key]: false }));
                flag++;
            }
        });
        return flag;
    }

    function validateOnChange(e) {
        const name = e.target.name;
        if (e.target.value.length <= 0) {
            setErrorMsg({ ...errorMsg, [name]: true });
        } else {
            setErrorMsg({ ...errorMsg, [name]: false });
        }
    }
    function handleChange(e) {
        validateOnChange(e);
        const name = e.target.name;
        const value = e.target.value;
        setItem({ ...item, [name]: value });
    }

    function handleSelect(e) {
        validateOnChange(e);
        const name = e.target.name;
        const index = e.target.selectedIndex;
        const el = e.target.childNodes[index];
        const option = el.getAttribute("id");

        setItem({
            ...item,
            [name]: { ...JSON.parse(e.target.value) },
        });
    }

    function handleImageFile(e) {
        validateOnChange(e);
        uploadImage(e.target.files);
    }

    function uploadImage(imgs) {
        Array.from(imgs).map((img) => {
            const storageRef = ref(storage, `/files/${img.name}`);
            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                },
                (err) => console.log(err),
                () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (url) => {
                            // console.log(url.name);
                            let imageName = await getMetadata(storageRef).then(
                                (metadata) => {
                                    return metadata.name;
                                }
                            );
                            console.log(imageName);
                            setImagesList((prev) => [
                                ...prev,
                                { url: url, name: imageName },
                            ]);
                        }
                    );
                }
            );
        });
    }

    function deleteImage(imageName) {
        const desertRef = ref(storage, `/files/${imageName}`);

        deleteObject(desertRef)
            .then(() => {
                const updatedList = imagesList.filter((img) => {
                    return img.name !== imageName;
                });
                setImagesList(updatedList);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {}, [errorMsg]);

    return (
        <Pagecontainer>
            <ItemHeader>{t("AddItem")} </ItemHeader>
            <Formcontainer>
                <FormItem method='post' onSubmit={addto}>
                    <ItemInput>
                        <LabelDiv>
                            <ItemTitle>{t("Title")}</ItemTitle>
                            {errorMsg.title && (
                                <ErrorLabel errorMsg={errorMsg}>
                                    {t("TitleisRequired")}
                                </ErrorLabel>
                            )}
                        </LabelDiv>
                        <TitleInput
                            placeholder={t("titlePlaceholder")}
                            type='text'
                            name='title'
                            onChange={handleChange}
                        />
                    </ItemInput>
                    <ItemInput>
                        <LabelDiv>
                            <ItemCatogry>{t("Catogry")}</ItemCatogry>
                            {errorMsg.category && (
                                <ErrorLabel errorMsg={errorMsg}>
                                    {t("CategoryisRequired")}
                                </ErrorLabel>
                            )}
                        </LabelDiv>
                        <CatogryInput
                            placeholder={t("Selectcatogryplaceholder")}
                            type='dropdown'
                            name='category'
                            onChange={handleSelect}
                        >
                            <Selectoption disabled selected>
                                {t("Selectcatogry")}
                            </Selectoption>
                            {categoriesList?.map((cate) => {
                                return (
                                    <Selectoption key={cate.id} id={cate.id}>
                                        {Router.locale === "ar"
                                            ? cate.name_ar
                                            : cate.name}
                                    </Selectoption>
                                );
                            })}
                        </CatogryInput>
                    </ItemInput>
                    <ItemInput>
                        <LabelDiv>
                            <ItemLocation>{t("Location")}</ItemLocation>
                            {errorMsg.location && (
                                <ErrorLabel errorMsg={errorMsg}>
                                    {t("LocationisRequired")}
                                </ErrorLabel>
                            )}
                        </LabelDiv>
                        <LocationInput name='location' onChange={handleSelect}>
                            <Locationoption disabled selected>
                                {t("SelectLocation")}
                            </Locationoption>
                            {locationList?.map((location) => {
                                return (
                                    <Locationoption
                                        key={location.id}
                                        id={location.id}
                                        value={JSON.stringify(location)}
                                    >
                                        {Router.locale === "ar"
                                            ? location.name_ar
                                            : location.name}
                                    </Locationoption>
                                );
                            })}
                        </LocationInput>
                    </ItemInput>
                    <ItemInput>
                        <LabelDiv>
                            <ItemDescription>
                                {t("Description")}
                            </ItemDescription>
                            {errorMsg.description && (
                                <ErrorLabel errorMsg={errorMsg}>
                                    {t("DescriptionisRequired")}
                                </ErrorLabel>
                            )}
                        </LabelDiv>
                        <DescriptionInput
                            placeholder={t("DescriptionItemplaceholder")}
                            rows='10'
                            cols='105'
                            name='description'
                            onChange={handleChange}
                        />
                    </ItemInput>
                    <ItemImageInput>
                        <Itemupload>{t("UploadPhotossection")}</Itemupload>
                        <ImagesDiv>
                            {imagesList.length === 0 ? (
                                <UploadContainer>
                                    <ItemImage
                                        alt='thumbnail'
                                        src={thumbnail}
                                        width='0'
                                        height='0'
                                    />

                                    <LabelDiv>
                                        <Uploadspan>
                                            {t("UploadPhotos")}
                                        </Uploadspan>
                                        {errorMsg.image && (
                                            <ErrorLabel errorMsg={errorMsg}>
                                                {t("photosareRequired")}
                                            </ErrorLabel>
                                        )}
                                    </LabelDiv>
                                    <UploadInput
                                        type='file'
                                        name='image'
                                        placeholder={t(
                                            "UploadPhotosplaceholder"
                                        )}
                                        onChange={handleImageFile}
                                        multiple
                                    />
                                </UploadContainer>
                            ) : (
                                <>
                                    {imagesList.map((SingleImage) => {
                                        return (
                                            <DisplayContainer
                                                key={SingleImage.url}
                                                onClick={() =>
                                                    deleteImage(
                                                        SingleImage.name
                                                    )
                                                }
                                            >
                                                <DeleteIcon>
                                                    <Image
                                                        src='./addToItem/delete.svg'
                                                        alt='delete icon'
                                                        width={30}
                                                        height={30}
                                                    />
                                                </DeleteIcon>
                                                <ItemImage
                                                    alt='product Image'
                                                    src={SingleImage.url}
                                                    width='300'
                                                    height='300'
                                                    quality={100}
                                                />

                                                <LabelDiv>
                                                    <Uploadspan>
                                                        {SingleImage.name === 0
                                                            ? "photo name "
                                                            : SingleImage.name}
                                                    </Uploadspan>
                                                    {errorMsg.image && (
                                                        <ErrorLabel
                                                            errorMsg={errorMsg}
                                                        >
                                                            {t(
                                                                "photosareRequired"
                                                            )}
                                                        </ErrorLabel>
                                                    )}
                                                </LabelDiv>
                                            </DisplayContainer>
                                        );
                                    })}
                                    <PlusDiv>
                                        +
                                        <UploadInput
                                            type='file'
                                            name='images'
                                            placeholder='Upload Photos'
                                            onChange={handleImageFile}
                                            multiple
                                        />
                                    </PlusDiv>
                                </>
                            )}
                        </ImagesDiv>
                    </ItemImageInput>
                    <Buttoncontainer>
                        <ConfirmButton
                            disabled={!imagesList}
                            imagesList={imagesList.length === 0 ? false : true}
                            type='submit'
                        >
                            <Confirmspan>{t("Confirm")}</Confirmspan>
                        </ConfirmButton>
                        <Link href='/listOfItems'>
                            <CancelButton type='submit'>
                                <Cancelspan>{t("Cancel")}</Cancelspan>
                            </CancelButton>
                        </Link>
                    </Buttoncontainer>
                </FormItem>
            </Formcontainer>
        </Pagecontainer>
    );
}

export default withTranslation("addItem")(AddItem);
